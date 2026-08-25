# Deployment Guide

Follow these steps in order. Total time: about 20–30 minutes the first time.

---

## STEP 1 — Create a free Supabase project

1. Go to https://supabase.com and click **Start your project** → sign up (free, no
   credit card needed).
2. Click **New project**.
   - Name: `awan-fast-fiber`
   - Database password: choose a strong password and **save it somewhere safe**.
   - Region: pick the one closest to Pakistan (e.g. Singapore).
3. Wait ~2 minutes while Supabase sets up your project.

## STEP 2 — Run the database migration

1. In your Supabase project, open the left sidebar → **SQL Editor**.
2. Click **New query**.
3. Open the file `supabase/migrations/0001_init.sql` from this project, copy
   **all** of its contents, and paste it into the SQL Editor.
4. Click **Run**. You should see "Success. No rows returned."
   - This creates all tables, security rules, storage buckets, and seed data
     (your packages, service areas, and FAQs).

## STEP 3 — Turn off email confirmation (recommended for now)

By default Supabase requires customers to click a confirmation email before they
can log in. Since you may not have a custom email sender configured yet:

1. Sidebar → **Authentication** → **Providers** → **Email**.
2. Turn **off** "Confirm email" (you can turn this back on later once you set up
   a custom email domain).
3. Save.

## STEP 4 — Get your API keys

1. Sidebar → **Project Settings** (gear icon) → **API**.
2. Copy two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (a long string)

You'll need both in Step 6.

## STEP 5 — Push this project to GitHub

1. Create a new (private is fine) GitHub repository.
2. Upload all the files in this project folder to that repository
   (drag-and-drop on GitHub's web UI works, or use `git push` if you're
   comfortable with Git).

## STEP 6 — Deploy to Netlify

1. Go to https://netlify.com → sign up / log in (free).
2. Click **Add new site** → **Import an existing project** → connect GitHub →
   select your repository.
3. Netlify will detect Next.js automatically. Before deploying, click
   **Add environment variables** and add:
   - `NEXT_PUBLIC_SUPABASE_URL` = the Project URL from Step 4
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = the anon public key from Step 4
4. Click **Deploy site**. Wait 2–3 minutes for the build to finish.
5. Netlify gives you a free URL like `awan-fast-fiber.netlify.app` — your site
   is now live.

## STEP 7 — Add your custom domain (optional)

If you own a domain (e.g. `awanfastfiber.com`):
1. Netlify → **Domain settings** → **Add a domain**.
2. Follow Netlify's instructions to point your domain's DNS to Netlify.

## STEP 8 — Create your first staff (admin) account

Staff accounts are created directly in Supabase for security — there's no public
"become an admin" button on the website.

1. In Supabase, sidebar → **Authentication** → **Users** → **Add user** →
   **Create new user**. Enter your email and a password. Click **Auto Confirm
   User**.
2. Copy the new user's **UID** (shown in the users list).
3. Sidebar → **Table Editor** → `profiles` table → **Insert row**:
   - `id`: paste the UID from step 2
   - `full_name`: your name
   - `mobile`: your number
   - `address`: office address
   - `is_staff`: `true`
   - `is_active`: `true`
   (leave `customer_id` empty for staff accounts)
4. Go to `staff_roles` table → **Insert row**:
   - `profile_id`: the same UID
   - `role`: `super_admin`
5. Now go to your live site → `/admin/login` → log in with that email/password.
   You should reach the Admin Dashboard.

## STEP 9 — Test the system

- Visit your site's homepage and check the Packages, Coverage, and About pages
  load with your seeded content.
- Register a test customer account at `/register` with a Customer ID like
  `AFF999` — confirm it works and rejects a duplicate ID if tried twice.
- Log in as that customer, submit a test complaint, and check it appears in
  `/admin/complaints` when logged in as staff.
- Submit a test payment proof from the customer dashboard, then verify it from
  `/admin/payments`.

---

## Updating content later

- **Packages, prices, FAQs, service areas** → edit directly in Supabase Table
  Editor, or use the Admin Dashboard (Packages page is already built; others can
  be added the same way).
- **Site text (hero heading, about text, contact info)** → edit the
  `website_settings` row in Supabase Table Editor.
- **Code changes** → edit the files and push to GitHub; Netlify redeploys
  automatically on every push.

## Troubleshooting

- **"Invalid API key" errors** → double-check the environment variables in
  Netlify match Supabase exactly (no extra spaces).
- **Registration fails silently** → check Supabase → Authentication → Providers
  → Email → "Confirm email" is turned off (Step 3), or check your email inbox
  for a confirmation link if it's on.
- **Admin login says "no staff access"** → recheck Step 8; the `is_staff` column
  must be `true` on the `profiles` row.
