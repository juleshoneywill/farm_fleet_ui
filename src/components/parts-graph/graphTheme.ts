// SVG attrs can't resolve CSS custom properties, so like CHART_COLORS on the
// machine page the graph colors are literal hex pairs keyed off useIsDark.
//
// Node system colors are categorical slots validated with the dataviz palette
// checker against this app's surfaces (#fffdf8 light / #1c1a15 dark), in
// fixed slot order, skipping the hues reserved elsewhere in the app: green
// (~status-good), red (~status-critical) and yellow (~accent-amber, worn by
// dependency edges). Light-mode aqua/magenta sit under 3:1 contrast, so node
// labels are always-visible direct labels (the relief rule).

export const SYSTEM_COLORS: Record<string, { light: string; dark: string }> = {
  engine: { light: "#2a78d6", dark: "#3987e5" },
  drivetrain: { light: "#1baf7a", dark: "#199e70" },
  chassis: { light: "#4a3aa7", dark: "#9085e9" },
  hydraulic: { light: "#e87ba4", dark: "#d55181" },
  electrical: { light: "#eb6834", dark: "#d95926" },
};

const FALLBACK_SYSTEM = { light: "#948c74", dark: "#948c74" };

export function systemColor(system: string, isDark: boolean): string {
  const pair = SYSTEM_COLORS[system] ?? FALLBACK_SYSTEM;
  return isDark ? pair.dark : pair.light;
}

export const GRAPH_COLORS = {
  light: {
    structural: "#c9c1ab",
    dependency: "#c98500", // --accent-amber
    surface: "#fffdf8",
    plane: "#f7f4ec",
    ink: "#211d13",
    inkSecondary: "#5c5645",
    muted: "#948c74",
  },
  dark: {
    structural: "#3d392c",
    dependency: "#eda100", // --accent-amber (dark)
    surface: "#1c1a15",
    plane: "#141310",
    ink: "#f5f2e9",
    inkSecondary: "#c7c0ab",
    muted: "#948c74",
  },
};

export type GraphColors = typeof GRAPH_COLORS.light;

// Node circle radius, shared by layout collision, edge trimming and render.
export const NODE_R = 12;
