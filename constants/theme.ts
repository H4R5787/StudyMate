export const Colors = {
  light: {
    primary: '#4361ee',
    primaryDark: '#3a56d4',
    primaryLight: '#eef2ff',
    secondary: '#3f37c9',
    accent: '#4895ef',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    background: '#f8fafc',
    cardBackground: '#ffffff',
    surface: '#f1f5f9',
    text: '#0f172a',
    secondaryText: '#64748b',
    border: '#e2e8f0',
    inputBackground: '#ffffff',
    placeholder: '#94a3b8',
    tabBarBackground: '#ffffff',
    tabBarBorder: '#e2e8f0',
    overlay: 'rgba(15, 23, 42, 0.6)',
  },
  dark: {
    primary: '#6366f1',
    primaryDark: '#4f46e5',
    primaryLight: '#1e1b4b',
    secondary: '#818cf8',
    accent: '#60a5fa',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#f87171',
    background: '#090d16',
    cardBackground: '#131b2e',
    surface: '#1e293b',
    text: '#f8fafc',
    secondaryText: '#94a3b8',
    border: '#1e293b',
    inputBackground: '#0f172a',
    placeholder: '#64748b',
    tabBarBackground: '#131b2e',
    tabBarBorder: '#1e293b',
    overlay: 'rgba(0, 0, 0, 0.75)',
  }
};

export type ThemeColors = typeof Colors.light;

export const Typography = {
  h1: { fontSize: 28, fontWeight: '800' as const, lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  bodyLarge: { fontSize: 16, fontWeight: '400' as const, lineHeight: 22 },
  body: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodySmall: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  caption: { fontSize: 11, fontWeight: '500' as const, lineHeight: 14 },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
