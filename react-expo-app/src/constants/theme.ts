/**
 * N8ture AI Design System
 *
 * Brand colors and design tokens for the N8ture AI app.
 * These values are derived from the brand identity and ensure
 * consistent visual design across the application.
 */

export const theme = {
  colors: {
    // Primary palette
    primary: {
      main: '#708C6A',        // Leaf Khaki - Primary brand color
      light: '#8FAF87',       // Accent Green
      dark: '#2D3A30',        // Forest Charcoal
      contrastText: '#FFFFFF',
    },

    // Secondary palette
    secondary: {
      main: '#8C8871',        // Earth Brown
      light: '#ABC8C5',       // Sky Blue
      dark: '#6B7265',
      contrastText: '#FFFFFF',
    },

    // Backgrounds
    background: {
      default: '#F7F7F5',
      paper: '#FFFFFF',
      elevated: '#FFFFFF',
    },

    // Text
    text: {
      primary: '#2B312B',
      secondary: '#6B7265',
      disabled: '#9CA39C',
      hint: '#B8BFB8',
    },

    // Status colors (nature-inspired)
    status: {
      safe: '#8FAF87',        // Green for safe/edible
      caution: '#D4A574',     // Warm brown for caution
      danger: '#A85C5C',      // Muted red for danger
      unknown: '#8C8871',     // Earth brown for unknown
      info: '#ABC8C5',        // Sky blue for info
    },

    // Functional colors
    success: '#8FAF87',
    warning: '#D4A574',
    error: '#A85C5C',
    info: '#ABC8C5',
  },

  // Spacing scale (8px base)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  // Typography
  typography: {
    fontFamily: {
      heading: 'System',
      body: 'System',
    },
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
      letterSpacing: -0.5,
      color: '#2B312B',
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
      letterSpacing: -0.3,
      color: '#2B312B',
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
      letterSpacing: -0.2,
      color: '#2B312B',
    },
    h4: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 24,
      color: '#2B312B',
    },
    body1: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
      color: '#2B312B',
    },
    body2: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
      color: '#6B7265',
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
      color: '#6B7265',
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 24,
      textTransform: 'none' as const,
    },
  },

  // Shadows (nature-inspired, subtle)
  shadows: {
    sm: {
      shadowColor: '#2D3A30',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#2D3A30',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#2D3A30',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
  },
} as const;

export type Theme = typeof theme;
