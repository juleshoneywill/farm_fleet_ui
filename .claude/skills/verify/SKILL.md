---
name: verify
description: Build/launch/drive recipe for verifying farm-fleet-ui changes end-to-end in a real browser.
---

# Verifying farm-fleet-ui

## Launch

- Dev server: `npm run dev` (port 3000). Often already running — check with
  `curl -s -o /dev/null localhost:3000 && echo running` before starting another.
- Backend: pages fetch from `NEXT_PUBLIC_API_URL` (Clojure/Datomic service in the
  sibling `temporal_DB_demo` repo, `clojure -M:serve`). Without it, `/`,
  `/machine/*`, and `/add` show error panels but still render; `/store/*` is
  fully client-side mock data and needs no backend.

## Drive (headless browser)

No Playwright dep in this repo. Recipe that works:

```bash
cd <scratchpad> && npm init -y && npm i playwright-core
```

Launch with the cached Chrome for Testing (adjust revision to what's in
`~/Library/Caches/ms-playwright/`):

```js
import { chromium } from "playwright-core";
const browser = await chromium.launch({
  executablePath: `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`,
});
```

## Flows worth driving

- Sidebar: collapse toggle (`getByTitle("Collapse sidebar")`), width 224 ↔ 56,
  persisted in localStorage `farm-fleet.sidebar-collapsed`; forced 56px rail
  below 768px viewport.
- Store: `/store` grid + category filter chips; `/store/[slug]` detail;
  add-to-cart updates the header badge (`header a[title='Cart'] span`).
- Cart: `/store/cart` — stepper caps at stock, remove, subtotal; persists in
  localStorage `farm-fleet.cart.v1` across reload; Checkout clears cart and
  shows "Order placed".
- Parts graph `/machine/JD-7230-0098/parts-graph`: assert
  `document.documentElement.scrollWidth === clientWidth` (no overflow) after
  sidebar changes.
- Dark mode: new context with `colorScheme: "dark"`.

## Gotchas

- The black "N" circle over the logo in screenshots is the Next.js dev-tools
  overlay, not an app element.
- Collect console errors via `page.on("console", ...)` to catch hydration
  warnings — the main risk in this codebase (localStorage must be read in
  effects, never in useState initializers).
