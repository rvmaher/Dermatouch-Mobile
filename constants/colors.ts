export const Colors = {
  primary: "#2D5A27",
  primaryLight: "#4A7C59",
  primaryDark: "#1A3D1A",

  secondary: "#E8F5E8",
  accent: "#D4AF37",
  accentLight: "#F4E4BC",

  background: "#FDFCFA",
  surface: "#FFFFFF",
  surfaceElevated: "#F8F6F3",

  text: "#1C1C1E",
  textSecondary: "#6D6D80",
  textTertiary: "#8E8E93",
  textOnPrimary: "#FFFFFF",

  success: "#34C759",
  warning: "#FF9500",
  error: "#FF3B30",
  info: "#007AFF",

  border: "#E5E5EA",
  divider: "#F2F2F7",

  shadow: "rgba(0, 0, 0, 0.08)",
  shadowDark: "rgba(0, 0, 0, 0.15)",

  overlay: "rgba(0, 0, 0, 0.4)",
  overlayLight: "rgba(255, 255, 255, 0.9)",
};

export default {
  light: {
    text: Colors.text,
    background: Colors.background,
    tint: Colors.primary,
    tabIconDefault: Colors.textTertiary,
    tabIconSelected: Colors.primary,
  },
};
