# YouthBiz OS

A digital operating system for young South African entrepreneurs. YouthBiz OS helps a founder move from **idea → plan → action → customers → finance → opportunities → growth** in one connected workspace.

Built as a functional MVP for the FNB App of the Year Hackathon.

## What it does

- **Onboarding** — set up a business profile (name, category, stage, goal, location, description)
- **Dashboard** — business health score, key metrics, business momentum, Next Best Action, quick actions, recent finance activity
- **My Business** — edit profile + a readiness checklist that responds to real data
- **Tasks** — create, edit, complete and delete tasks with category, priority and due date
- **Finance** — record income and expenses; see totals and current balance (income − expenses)
- **Customers** — track leads, prospects and customers; change status; see pipeline value
- **Opportunities** — browse demo opportunities (grants, programmes, competitions) and save them
- **YouthBiz Advisor** — ask business questions and get contextual advice based on your live data
- **Settings** — edit your name, view business info, reset demo data

## YouthBiz Intelligence

The dashboard's "Next Best Action" and the Advisor both use a local recommendation engine in `src/lib/logic.ts` and `src/lib/advisor.ts`. It looks at your actual tasks, customers, transactions and profile — no external AI API is required. The advisor code is structured so an external AI API can be wired in later without changing the UI.

## Tech stack

- **React** + **TypeScript**
- **Vite** (dev server and build)
- **Tailwind CSS** for styling
- **lucide-react** for icons
- **localStorage** for persistence (browser only — no backend required for the demo)

No heavy frameworks. The code is plain React components you can read and edit.

## Getting started

```bash
# install dependencies
npm install

# run the dev server
npm run dev

# type-check
npm run typecheck

# build for production
npm run build

# preview the production build
npm run preview
```

## Where the code lives

```
src/
  App.tsx                  # root — wires the store, onboarding and page routing
  main.tsx                 # entry point
  index.css                # Tailwind + base styles
  types.ts                 # all data models (Task, Transaction, Customer, etc.)
  store/
    StoreContext.tsx       # global state + all mutation actions (CRUD)
  lib/
    storage.ts             # localStorage load/save/clear
    sampleData.ts          # the FlowPrint demo data
    logic.ts               # health score, momentum, Next Best Action, selectors
    advisor.ts             # the YouthBiz Advisor recommendation engine
  components/
    Layout.tsx             # sidebar + mobile nav shell
    Onboarding.tsx         # first-run business setup
    ui/                    # Modal, Field, StatCard, ProgressRing
  pages/
    Dashboard.tsx
    BusinessPage.tsx
    TasksPage.tsx
    FinancePage.tsx
    CustomersPage.tsx
    OpportunitiesPage.tsx
    AdvisorPage.tsx
    SettingsPage.tsx
    TaskModal.tsx
    TransactionModal.tsx
    CustomerModal.tsx
```

## How demo data works

On first load, the app seeds a realistic sample business — **FlowPrint**, a Johannesburg tech startup run by "Shaun" — with tasks, transactions and customers so the dashboard is not empty. You can edit or delete any of it.

- Data is saved to `localStorage` under the key `youthbiz-os:v1`, so it survives a browser refresh.
- **Settings → Reset to demo data** restores the original FlowPrint sample.
- **Settings → Clear all data** resets back to the sample (acts as a clean slate).
- New users who complete onboarding instead of using the sample get an empty workspace with the seed opportunities still available.

## Notes for judges

- Every button, form and navigation item has a real function.
- The Opportunities are clearly labelled as demonstration data, not live verified listings.
- The Advisor is a local recommendation engine — not a fake AI — and its answers change based on your data.
- The data layer (`store/StoreContext.tsx`) is isolated, so a real backend (e.g. Supabase) can be added later without touching the UI.
