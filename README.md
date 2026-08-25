# Awan Fast Fiber — Web Platform

A real, database-backed ISP platform for Awan Fast Fiber: public website, customer
portal (register/login, complaints, connection requests, payments), and an admin
dashboard for staff.

**This is not a static site.** It needs a free [Supabase](https://supabase.com)
project for its database and login system. See `DEPLOYMENT.md` for exact,
step-by-step setup and Netlify deployment instructions — start there.

## What's included in this version

- Public website: Home, Packages, Coverage checker, About/Company History, Contact, FAQ
- Customer registration & login (self-chosen Customer ID, e.g. `AFF001`)
- Customer dashboard: submit & track complaints, connection request status, payment
  proof upload & history
- Admin dashboard: stats overview, customers, connection requests, complaints
  (status + tracking), payments (verify/reject with proof viewing), packages (CRUD)
- Database schema with Row Level Security (customers only ever see their own data)
- Private storage for payment proofs and complaint attachments
- English/Urdu language toggle
- Basic PWA (installable, manifest + icons)
- WhatsApp buttons throughout

## Not yet included (future passes)

- Fine-grained staff roles (Manager / Support / Payment / Technician permissions —
  currently all staff accounts have full access)
- Offers & banners CMS, full audit log UI
- Android app (React Native)
- Full Urdu translation of all page content (nav + key UI is translated; page
  copy is currently English-only)

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase URL + anon key
npm run dev
```

## Project structure

```
app/            Pages (Next.js App Router)
  admin/        Staff dashboard (protected)
  dashboard/    Customer dashboard (protected)
components/     Shared UI components
lib/            Supabase clients, i18n, constants, utils
supabase/       Database migration (SQL)
```

See `DEPLOYMENT.md` for how to go from these files to a live website.
