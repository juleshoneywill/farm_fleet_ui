import {
  CircleDot,
  Cog,
  Droplets,
  Filter,
  Settings2,
  Zap,
} from "lucide-react";

export const CATEGORIES = [
  "engine",
  "hydraulics",
  "electrical",
  "filters",
  "drivetrain",
  "tires-tracks",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_META: Record<
  Category,
  { label: string; icon: React.ComponentType<{ size?: number | string }> }
> = {
  engine: { label: "Engine", icon: Cog },
  hydraulics: { label: "Hydraulics", icon: Droplets },
  electrical: { label: "Electrical", icon: Zap },
  filters: { label: "Filters", icon: Filter },
  drivetrain: { label: "Drivetrain", icon: Settings2 },
  "tires-tracks": { label: "Tires & Tracks", icon: CircleDot },
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  /** Price in cents — keep integer math, format with formatPrice(). */
  price: number;
  description: string;
  /** 0 means out of stock; add-to-cart is disabled. */
  stock: number;
  /** Machine serials this part fits — links to /machine/[serial]. */
  compatible?: string[];
};

export const PRODUCTS: Product[] = [
  {
    id: "p-001",
    slug: "fuel-injector-jd7230",
    name: "Fuel Injector — JD 7230",
    category: "engine",
    price: 24900,
    description:
      "Direct-replacement common-rail fuel injector for the PowerTech 6.8L. Bench-tested spray pattern and flow-matched to OEM spec.",
    stock: 14,
    compatible: ["JD-7230-0098"],
  },
  {
    id: "p-002",
    slug: "turbocharger-cartridge",
    name: "Turbocharger Cartridge",
    category: "engine",
    price: 68500,
    description:
      "Balanced CHRA cartridge for wastegated turbos on mid-frame row-crop tractors. Includes gasket kit and oil feed line.",
    stock: 5,
  },
  {
    id: "p-003",
    slug: "head-gasket-set",
    name: "Cylinder Head Gasket Set",
    category: "engine",
    price: 18750,
    description:
      "Multi-layer steel head gasket set with valve cover and manifold gaskets. Torque-to-yield bolt kit included.",
    stock: 22,
  },
  {
    id: "p-004",
    slug: "hydraulic-pump-45cc",
    name: "Hydraulic Piston Pump 45cc",
    category: "hydraulics",
    price: 112000,
    description:
      "Variable-displacement axial piston pump, 45cc/rev, load-sensing. Drop-in for closed-center hitch and loader circuits.",
    stock: 3,
    compatible: ["JD-7230-0098"],
  },
  {
    id: "p-005",
    slug: "scv-valve-block",
    name: "SCV Valve Block (Dual)",
    category: "hydraulics",
    price: 45600,
    description:
      "Dual-spool selective control valve block with detent and float positions. Couplers and O-rings included.",
    stock: 9,
  },
  {
    id: "p-006",
    slug: "hydraulic-hose-kit",
    name: "Hydraulic Hose Kit 3/8\"",
    category: "hydraulics",
    price: 7900,
    description:
      "Four-wire braided 3/8\" hose kit, 3m lengths with JIC-8 ends, rated 350 bar. Sold as a pair.",
    stock: 40,
  },
  {
    id: "p-007",
    slug: "alternator-150a",
    name: "Alternator 150A 12V",
    category: "electrical",
    price: 31200,
    description:
      "Heavy-duty 150-amp alternator with dust-sealed bearings for cab tractors running LED work-light packages.",
    stock: 11,
  },
  {
    id: "p-008",
    slug: "wiring-harness-cab",
    name: "Cab Wiring Harness",
    category: "electrical",
    price: 26400,
    description:
      "Complete cab harness with sealed Deutsch connectors, pre-loomed for monitor, HVAC, and radio circuits.",
    stock: 0,
  },
  {
    id: "p-009",
    slug: "starter-motor-gear-reduction",
    name: "Gear-Reduction Starter Motor",
    category: "electrical",
    price: 19800,
    description:
      "High-torque gear-reduction starter, 4.2 kW, cold-weather rated. Direct bolt-in with OEM flange pattern.",
    stock: 8,
    compatible: ["JD-7230-0098"],
  },
  {
    id: "p-010",
    slug: "engine-oil-filter-3pk",
    name: "Engine Oil Filter (3-pack)",
    category: "filters",
    price: 4200,
    description:
      "Full-flow spin-on oil filters with anti-drainback valve, 25-micron media. Three service intervals per box.",
    stock: 60,
  },
  {
    id: "p-011",
    slug: "hydraulic-return-filter",
    name: "Hydraulic Return Filter",
    category: "filters",
    price: 6800,
    description:
      "10-micron glass-media return filter with bypass indicator port. Fits common reservoir-top housings.",
    stock: 35,
  },
  {
    id: "p-012",
    slug: "final-drive-planetary-kit",
    name: "Final Drive Planetary Kit",
    category: "drivetrain",
    price: 89900,
    description:
      "Planetary gear set with carrier, bearings, and seals for rear final drives. Case-hardened gears, OEM tolerances.",
    stock: 2,
  },
  {
    id: "p-013",
    slug: "pto-clutch-pack",
    name: "PTO Clutch Pack",
    category: "drivetrain",
    price: 38500,
    description:
      "Wet clutch pack for 540/1000 PTO units — friction and steel plates plus piston seals in one kit.",
    stock: 7,
    compatible: ["JD-7230-0098"],
  },
  {
    id: "p-014",
    slug: "rear-tire-480-80r46",
    name: "Rear Tire 480/80R46",
    category: "tires-tracks",
    price: 154000,
    description:
      "Radial R-1W rear tire with reinforced sidewall for row-crop duty. Sold individually; tube not required.",
    stock: 6,
  },
  {
    id: "p-015",
    slug: "track-belt-25in",
    name: "Rubber Track Belt 25\"",
    category: "tires-tracks",
    price: 210000,
    description:
      "25-inch friction-drive rubber track belt with steel cord carcass for narrow-frame track tractors.",
    stock: 0,
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(cents: number): string {
  return usd.format(cents / 100);
}
