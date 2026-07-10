"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  ShoppingCart,
  Store,
} from "lucide-react";
import { useCart } from "@/lib/cart";

// The parts graph is seeded for the demo tractor only, so the nav link deep
// links straight to it.
const GRAPH_HREF = "/machine/JD-7230-0098/parts-graph";

type IconType = React.ComponentType<{ size?: number | string }>;

export default function AppSidebar({
  collapsed,
  hydrated,
  onToggle,
}: {
  collapsed: boolean;
  /** Suppresses the width transition until stored state has loaded. */
  hydrated: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const onGraph = pathname.endsWith("/parts-graph");
  const onCart = pathname === "/store/cart";
  const onStore = pathname.startsWith("/store") && !onCart;
  const onAdd = pathname === "/add";
  const { count, hydrated: cartHydrated } = useCart();
  const cartBadge = cartHydrated && count > 0 ? count : undefined;

  return (
    <aside
      className={`sticky top-[65px] flex h-[calc(100vh-65px)] shrink-0 flex-col overflow-y-auto border-r border-border-hairline bg-surface ${
        hydrated ? "transition-[width] duration-200" : ""
      } ${collapsed ? "w-14" : "w-14 md:w-56"}`}
    >
      <nav className="flex flex-1 flex-col gap-1 p-2">
        <SectionHeading collapsed={collapsed} label="Parts Store" />
        <SideLink
          href="/store"
          label="Store"
          icon={Store}
          active={onStore}
          collapsed={collapsed}
        />
        <SideLink
          href="/store/cart"
          label="Cart"
          icon={ShoppingCart}
          active={onCart}
          collapsed={collapsed}
          badge={cartBadge}
        />

        <SectionHeading collapsed={collapsed} label="Fleet & Temporal DB" />
        <SideLink
          href="/"
          label="Fleet"
          icon={LayoutGrid}
          active={!onGraph && !onCart && !onStore && !onAdd}
          collapsed={collapsed}
        />
        <SideLink
          href={GRAPH_HREF}
          label="Parts graph"
          icon={Network}
          active={onGraph}
          collapsed={collapsed}
        />
        <SideLink
          href="/add"
          label="Add entity"
          icon={Plus}
          active={onAdd}
          collapsed={collapsed}
        />

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!collapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`mt-auto hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-ink-secondary transition-colors hover:bg-surface-2/60 hover:text-ink-primary md:inline-flex ${
            collapsed ? "justify-center" : "justify-start"
          }`}
        >
          {collapsed ? (
            <PanelLeftOpen size={15} />
          ) : (
            <PanelLeftClose size={15} />
          )}
          {!collapsed && <span>Collapse</span>}
        </button>
      </nav>
    </aside>
  );
}

function SectionHeading({
  collapsed,
  label,
}: {
  collapsed: boolean;
  label: string;
}) {
  return (
    <>
      {/* Hairline divider stands in for the heading on the icon rail. */}
      <div
        className={`mx-2 mt-3 mb-1 border-t border-border-hairline first:mt-1 first:border-t-0 ${
          collapsed ? "" : "md:hidden"
        }`}
      />
      {!collapsed && (
        <div className="mt-3 mb-1 hidden px-3 text-[11px] font-semibold uppercase tracking-wider text-ink-muted first:mt-1 md:block">
          {label}
        </div>
      )}
    </>
  );
}

function SideLink({
  href,
  label,
  icon: Icon,
  active,
  collapsed,
  badge,
}: {
  href: string;
  label: string;
  icon: IconType;
  active: boolean;
  collapsed: boolean;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      title={label}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        collapsed ? "justify-center" : "justify-center md:justify-start"
      } ${
        active
          ? "bg-surface-2 text-ink-primary"
          : "text-ink-secondary hover:bg-surface-2/60 hover:text-ink-primary"
      }`}
    >
      <span className="relative shrink-0">
        <Icon size={15} />
        {/* Dot-style badge for the icon rail (collapsed, or any width < md). */}
        {badge !== undefined && (
          <span
            className={`absolute -top-1.5 -right-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-accent-green px-0.5 text-[9px] font-semibold text-white ${
              collapsed ? "" : "md:hidden"
            }`}
          >
            {badge}
          </span>
        )}
      </span>
      {!collapsed && (
        <>
          <span className="hidden md:inline">{label}</span>
          {badge !== undefined && (
            <span className="ml-auto hidden h-4 min-w-4 items-center justify-center rounded-full bg-accent-green px-1 text-[10px] font-semibold text-white md:inline-flex">
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}
