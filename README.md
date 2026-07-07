# WheatFlow Command

Premium UI-only React demo for a wheat/flour supply-chain distribution platform.

The app is a clickable CEO sales demo that shows wheat moving from vessel intake through silos, milling, warehouse inventory, agent orders, approvals, OTP-secured dispatch, and completed delivery. It uses fake data only and makes no API calls.

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React icons
- shadcn/ui-inspired local components

## Run

```bash
npm install
npm run dev
```

## Verify

```bash
npm run lint
npm run build
```

## Deploy

This repository includes a GitHub Pages workflow at `.github/workflows/deploy-pages.yml`.
It builds the Vite app with the repository base path and publishes `dist/`.

The workflow also copies `dist/index.html` to `dist/404.html` so direct refreshes on
client routes such as `/en/dashboard` and `/ar/reports` fall back to the React app.

## Demo Notes

- Mock data lives in `src/data/mock.ts`.
- The role switcher previews CEO, Sales Manager, Accountant, Warehouse Keeper, and Agent access modes without real authentication.
- The order flow is local state only: `Draft → Sales Approved → Accountant Approved → Release Order Generated → OTP Verified → Dispatched → Completed`.
- The OTP demo code is `482916`.
- The generated visual reference used for the implementation is stored at `docs/design-reference/ceo-dashboard-concept.png`.
