# Farm Fleet UI (Next.js)

The web frontend for the [temporal_DB_demo](../temporal_DB_demo) project — a
Datomic-backed farm machinery database where history and time-travel are
built into the database itself. This UI's job is to make that visible: the
same fleet queries, re-run *as of any date you pick*.

Built with Next.js (App Router) + React 19, Tailwind CSS 4, Recharts for
charts, and d3-force for the parts graph layout.

## What's in it

- **Fleet overview** (`/`) — every machine as a card, with stat tiles
  (active / under repair / sold / total mileage). The date picker in the
  header re-runs the same query against `GET /api/fleet/as-of?date=...`, so
  you can watch machines appear, break down, and get sold as you scrub
  through time.
- **Machine detail** (`/machine/[serial]`) — mileage charted over time,
  full status history, the chronological service log, and total service
  cost, all from `GET /api/machine/:serial/history`.
- **Parts graph** (`/machine/[serial]/parts-graph`) — a force-directed graph
  of the machine's parts. Structural edges show physical assembly;
  dependency edges are directed "if this breaks, also reorder that" links.
  Selecting a part BFS-walks the dependency edges (`src/lib/cascade.ts`) and
  highlights the full reorder cascade.
- **Add data** (`/add`) — a form generated at runtime from
  `GET /api/schema`, so each entity type (machine, service, ...) renders
  whatever attributes it actually has; new backend attributes show up here
  with no UI changes. Submits to `POST /api/entity/:ns` (machines upsert by
  serial), including optional backdating via the `as-of` field.
- **Parts store** (`/store`, `/store/[slug]`, `/store/cart`) — a small
  static-data storefront with category filters and a client-side cart
  (`src/lib/store-data.ts`, `src/lib/cart.tsx`). It does not talk to the
  API.

## Running it

The UI is thin by design — almost everything comes from the Clojure API, so
that has to be running first (from `../temporal_DB_demo`):

```bash
clojure -M:serve     # Farm API on http://localhost:3001
```

Then:

```bash
npm install
npm run dev          # UI on http://localhost:3000
```

Or start both at once from the API project:

```bash
../temporal_DB_demo/start.sh
```

The API base URL comes from `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Project layout

```
src/
  app/
    page.tsx                        fleet overview + as-of date picker
    machine/[serial]/page.tsx       machine detail (charts, history, service log)
    machine/[serial]/parts-graph/   force-directed parts graph
    add/page.tsx                    schema-driven insert form
    store/                          static parts store + cart
  components/
    parts-graph/                    graph view, node/edge layers, force layout hook
    store/                          product card, cart controls
    EntityForm.tsx                  renders a form from the live API schema
  lib/
    api.ts                          typed client for every Farm API endpoint
    cascade.ts                      BFS over dependency edges (reorder cascade)
    cart.tsx / store-data.ts        client-side store state + catalog
```

## Notes

- All pages are client components fetching with `cache: "no-store"` — the
  point of the demo is live time-travel queries, not static rendering.
- If a page shows "Failed to load", the API almost certainly isn't running;
  see [temporal_DB_demo's README](../temporal_DB_demo/README.md) for its
  one-time Datomic storage setup (`~/.datomic/local.edn`).
