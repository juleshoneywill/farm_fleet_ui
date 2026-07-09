import { useEffect, useState } from "react";

// Recharts needs literal color strings (SVG attrs don't resolve our CSS
// custom properties), so chart colors are picked in JS from the same tokens
// defined in globals.css, keyed off the same media query.
export function useIsDark() {
  const [isDark, setIsDark] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  return isDark;
}
