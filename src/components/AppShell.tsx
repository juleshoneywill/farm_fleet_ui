"use client";

import { useEffect, useState } from "react";
import SiteHeader from "./SiteHeader";
import AppSidebar from "./AppSidebar";

const STORAGE_KEY = "farm-fleet.sidebar-collapsed";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem(STORAGE_KEY) === "true");
    setHydrated(true);
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      localStorage.setItem(STORAGE_KEY, String(!prev));
      return !prev;
    });
  };

  return (
    <>
      <SiteHeader />
      <div className="flex">
        <AppSidebar collapsed={collapsed} hydrated={hydrated} onToggle={toggle} />
        <div className="flex min-h-[calc(100vh-65px)] min-w-0 flex-1 flex-col">
          {children}
        </div>
      </div>
    </>
  );
}
