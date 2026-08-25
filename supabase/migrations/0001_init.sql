-- ============================================================
-- AWAN FAST FIBER — Initial Database Schema
-- Run this in Supabase SQL Editor (or via `supabase db push`)
-- ============================================================

create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- 1. PROFILES (extends Supabase auth.users)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  customer_id text unique,                 -- e.g. AFF001, null for staff-only accounts
  full_name text not null,
  mobile text not null,
  address text not null,
  service_area_id uuid,
  is_staff boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2. STAFF ROLES
-- ------------------------------------------------------------
create table if not exists public.staff_roles (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('super_admin','manager','support_staff','payment_staff','technician')),
  created_at timestamptz not null default now(),
  unique (profile_id)
);

-- ------------------------------------------------------------
-- 3. SERVICE AREAS
-- ------------------------------------------------------------
create table if not exists public.service_areas (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles
  add constraint profiles_service_area_fk
  foreign key (service_area_id) references public.service_areas(id);

-- ------------------------------------------------------------
-- 4. PACKAGES
-- ------------------------------------------------------------
create table if not exists public.packages (
  id uuid primary key default uuid_generate_v4(),
  speed_mbps integer not null,
  price integer not null,
  description text,
  features text[] default '{}',
  is_popular boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 5. CONNECTION REQUESTS
-- ------------------------------------------------------------
create sequence if not exists connection_request_seq start 1;

create table if not exists public.connection_requests (
  id uuid primary key default uuid_generate_v4(),
  request_code text unique not null default
    ('CON-' || to_char(now(),'YYYY') || '-' || lpad(nextval('connection_request_seq')::text,4,'0')),
  profile_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  customer_id text,
  mobile text not null,
  email text,
  address text not null,
  service_area_id uuid references public.service_areas(id),
  package_id uuid references public.packages(id),
  status text not null default 'New'
    check (status in ('New','Contacted','Approved','Installation Scheduled','Installed','Rejected','Completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 6. COMPLAINTS
-- ------------------------------------------------------------
create sequence if not exists complaint_seq start 1;

create table if not exists public.complaints (
  id uuid primary key default uuid_generate_v4(),
  complaint_code text unique not null default
    ('CMP-' || to_char(now(),'YYYY') || '-' || lpad(nextval('complaint_seq')::text,4,'0')),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  category text not null check (category in ('Red Light','Internet Slow','No Internet','Other')),
  details text not null,
  attachment_url text,
  status text not null default 'New'
    check (status in ('New','In Progress','Assigned','Resolved','Closed')),
  assigned_staff_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Internal staff-only notes / status history (never shown to customer)
create table if not exists public.complaint_updates (
  id uuid primary key default uuid_generate_v4(),
  complaint_id uuid not null references public.complaints(id) on delete cascade,
  staff_id uuid references public.profiles(id),
  note text not null,
  is_internal boolean not null default true,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 7. PAYMENTS
-- ------------------------------------------------------------
create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  package_id uuid references public.packages(id),
  amount integer not null,
  transaction_reference text,
  proof_storage_path text,               -- private bucket path, never public
  status text not null default 'Pending' check (status in ('Pending','Verified','Rejected')),
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 8. CONTACT MESSAGES
-- ------------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text,
  phone text,
  subject text,
  message text not null,
  status text not null default 'Unread' check (status in ('Unread','Read','Replied','Closed')),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 9. NOTIFICATIONS
-- ------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 10. FAQS
-- ------------------------------------------------------------
create table if not exists public.faqs (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

-- ------------------------------------------------------------
-- 11. WEBSITE SETTINGS (single-row CMS content)
-- ------------------------------------------------------------
create table if not exists public.website_settings (
  id int primary key default 1,
  hero_heading text,
  hero_subheading text,
  about_text text,
  phone text,
  whatsapp text,
  email text,
  facebook_url text,
  instagram text,
  tiktok text,
  youtube text,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

-- ------------------------------------------------------------
-- 12. AUDIT LOGS
-- ------------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references public.profiles(id),
  action text not null,
  target text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- INDEXES
-- ------------------------------------------------------------
create index if not exists idx_profiles_customer_id on public.profiles(customer_id);
create index if not exists idx_complaints_profile on public.complaints(profile_id);
create index if not exists idx_complaints_status on public.complaints(status);
create index if not exists idx_connection_status on public.connection_requests(status);
create index if not exists idx_payments_profile on public.payments(profile_id);

-- ============================================================
-- HELPER FUNCTION: is the current user staff?
-- ============================================================
create or replace function public.is_staff()
returns boolean
language sql
security definer
stable
as $$
  select coalesce(
    (select is_staff from public.profiles where id = auth.uid()),
    false
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.staff_roles
    where profile_id = auth.uid() and role = 'super_admin'
  );
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.staff_roles enable row level security;
alter table public.service_areas enable row level security;
alter table public.packages enable row level security;
alter table public.connection_requests enable row level security;
alter table public.complaints enable row level security;
alter table public.complaint_updates enable row level security;
alter table public.payments enable row level security;
alter table public.contact_messages enable row level security;
alter table public.notifications enable row level security;
alter table public.faqs enable row level security;
alter table public.website_settings enable row level security;
alter table public.audit_logs enable row level security;

-- PROFILES: user sees/edits own row; staff sees all
create policy "profiles_select_own_or_staff" on public.profiles
  for select using (auth.uid() = id or public.is_staff());
create policy "profiles_insert_self" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own_or_staff" on public.profiles
  for update using (auth.uid() = id or public.is_staff());

-- STAFF ROLES: only staff can view, only super admin can modify
create policy "staff_roles_select" on public.staff_roles
  for select using (public.is_staff());
create policy "staff_roles_modify" on public.staff_roles
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- SERVICE AREAS: public read (active only), staff full access
create policy "service_areas_public_read" on public.service_areas
  for select using (is_active = true or public.is_staff());
create policy "service_areas_staff_write" on public.service_areas
  for all using (public.is_staff()) with check (public.is_staff());

-- PACKAGES: public read (active only), staff full access
create policy "packages_public_read" on public.packages
  for select using (is_active = true or public.is_staff());
create policy "packages_staff_write" on public.packages
  for all using (public.is_staff()) with check (public.is_staff());

-- CONNECTION REQUESTS: anyone can submit; owner or staff can view
create policy "connection_requests_insert_anyone" on public.connection_requests
  for insert with check (true);
create policy "connection_requests_select_own_or_staff" on public.connection_requests
  for select using (profile_id = auth.uid() or public.is_staff());
create policy "connection_requests_update_staff" on public.connection_requests
  for update using (public.is_staff());

-- COMPLAINTS: customer sees only their own; staff sees all
create policy "complaints_insert_own" on public.complaints
  for insert with check (profile_id = auth.uid());
create policy "complaints_select_own_or_staff" on public.complaints
  for select using (profile_id = auth.uid() or public.is_staff());
create policy "complaints_update_staff" on public.complaints
  for update using (public.is_staff());

-- COMPLAINT UPDATES: staff only (internal notes never visible to customers)
create policy "complaint_updates_staff_only" on public.complaint_updates
  for all using (public.is_staff()) with check (public.is_staff());

-- PAYMENTS: customer sees only their own; staff sees all; only staff verifies
create policy "payments_insert_own" on public.payments
  for insert with check (profile_id = auth.uid());
create policy "payments_select_own_or_staff" on public.payments
  for select using (profile_id = auth.uid() or public.is_staff());
create policy "payments_update_staff" on public.payments
  for update using (public.is_staff());

-- CONTACT MESSAGES: anyone can submit; staff only can read
create policy "contact_messages_insert_anyone" on public.contact_messages
  for insert with check (true);
create policy "contact_messages_select_staff" on public.contact_messages
  for select using (public.is_staff());
create policy "contact_messages_update_staff" on public.contact_messages
  for update using (public.is_staff());

-- NOTIFICATIONS: owner only
create policy "notifications_select_own" on public.notifications
  for select using (profile_id = auth.uid());
create policy "notifications_update_own" on public.notifications
  for update using (profile_id = auth.uid());
create policy "notifications_staff_insert" on public.notifications
  for insert with check (public.is_staff());

-- FAQS: public read (active only), staff write
create policy "faqs_public_read" on public.faqs
  for select using (is_active = true or public.is_staff());
create policy "faqs_staff_write" on public.faqs
  for all using (public.is_staff()) with check (public.is_staff());

-- WEBSITE SETTINGS: public read, staff write
create policy "website_settings_public_read" on public.website_settings
  for select using (true);
create policy "website_settings_staff_write" on public.website_settings
  for all using (public.is_staff()) with check (public.is_staff());

-- AUDIT LOGS: staff read only, system inserts
create policy "audit_logs_staff_read" on public.audit_logs
  for select using (public.is_staff());
create policy "audit_logs_staff_insert" on public.audit_logs
  for insert with check (public.is_staff());

-- ============================================================
-- STORAGE BUCKET for payment proofs (private) + complaint attachments
-- ============================================================
insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('complaint-attachments', 'complaint-attachments', false)
on conflict (id) do nothing;

create policy "payment_proofs_owner_upload" on storage.objects
  for insert with check (
    bucket_id = 'payment-proofs' and auth.uid()::text = (storage.foldername(name))[1]
  );
create policy "payment_proofs_owner_or_staff_read" on storage.objects
  for select using (
    bucket_id = 'payment-proofs' and
    (auth.uid()::text = (storage.foldername(name))[1] or public.is_staff())
  );

create policy "complaint_attach_owner_upload" on storage.objects
  for insert with check (
    bucket_id = 'complaint-attachments' and auth.uid()::text = (storage.foldername(name))[1]
  );
create policy "complaint_attach_owner_or_staff_read" on storage.objects
  for select using (
    bucket_id = 'complaint-attachments' and
    (auth.uid()::text = (storage.foldername(name))[1] or public.is_staff())
  );

-- ============================================================
-- SEED DATA
-- ============================================================
insert into public.service_areas (name, description) values
  ('Chak 481', 'Core coverage area'),
  ('Chak 480', 'Coverage area'),
  ('Chak 484', 'Coverage area'),
  ('Chak 491', 'Coverage area'),
  ('Waryam Wala', 'Coverage area'),
  ('Majhi Sultan', 'Coverage area')
on conflict (name) do nothing;

insert into public.packages (speed_mbps, price, description, is_popular, sort_order) values
  (10, 1800, 'Great for browsing and social media', false, 1),
  (15, 2300, 'Good for a small household', false, 2),
  (20, 2800, 'Smooth streaming and video calls', true, 3),
  (25, 3200, 'Ideal for multiple devices', false, 4),
  (30, 3600, 'Heavy streaming and downloads', false, 5),
  (40, 4000, 'For power users and small offices', false, 6),
  (50, 5000, 'Our fastest home package', false, 7)
on conflict do nothing;

insert into public.website_settings (id, hero_heading, hero_subheading, about_text, phone, whatsapp, email, facebook_url, instagram, tiktok, youtube)
values (
  1,
  'Fast, Reliable Fiber Internet for Your Community',
  'Awan Fast Fiber connects homes across Chak 481 JB and nearby villages with dependable, affordable internet.',
  'Awan Fast Fiber was established on May 1, 2021, with the aim of providing reliable and affordable internet services to underserved communities. The business was founded and is operated by brothers Shoaib Aslam Awan and Shaban Aslam Awan, sons of M. Aslam, belonging to the Awan family of Chak No. 481 JB. The business initially started with Fiber-to-the-Home (FTTH) and wireless connectivity, gradually expanding its network to several villages where high-speed internet was in strong demand. As the customer base and network requirements continued to grow, a major step forward was taken in November 2025 with the deployment of the main fiber-optic backbone line. This helped improve network reliability, capacity, and service quality and provided a stronger foundation for future expansion. Awan Fast Fiber operates under the name National Broadband, and its internet bandwidth is powered by Cybernet. The goal of Awan Fast Fiber is to continue expanding its fiber network and provide fast, stable, reliable, and affordable internet connectivity to more communities.',
  '03456252019',
  '03456252019',
  'shoaibaslam6252@gmail.com',
  'https://www.facebook.com/share/1HWjAFcsdW/',
  'awanfastfiber481',
  'awanfastfiber481',
  'awanfastfiber481'
)
on conflict (id) do nothing;

insert into public.faqs (question, answer, sort_order) values
  ('What packages are available?', 'We offer packages from 10 Mbps to 50 Mbps. Visit our Packages page for current pricing.', 1),
  ('How much is a new connection?', 'A new connection costs Rs. 6,500, which includes 50 meters of fiber cable and an ONT device.', 2),
  ('How much fiber is included?', '50 meters of fiber cable is included with every new connection.', 3),
  ('Is ONT included?', 'Yes, the ONT (Optical Network Terminal) device is included in the new connection price.', 4),
  ('How can I submit a complaint?', 'Log in to your customer dashboard and use the Submit Complaint option, or contact us via WhatsApp.', 5),
  ('How can I track my complaint?', 'Every complaint gets a unique Complaint ID (e.g. CMP-2026-0001) which you can track from your dashboard.', 6),
  ('How can I pay?', 'We currently accept payments via EasyPaisa. Upload your payment proof from your dashboard after paying.', 7),
  ('Where is Awan Fast Fiber available?', 'We currently serve Chak 481, Chak 480, Chak 484, Chak 491, Waryam Wala, and Majhi Sultan.', 8),
  ('How can I contact support?', 'You can call or WhatsApp us at 03456252019, or use the Contact Us form on this website.', 9)
on conflict do nothing;
