/**
 * Design Tokens - Premium LexAI
 * Centralized design values following Apple's design philosophy
 */

// Premium Animation Easings
export const premiumEasings = {
  // Apple's signature easing curves
  smooth: [0.16, 1, 0.3, 1] as const,
  bounce: [0.175, 0.885, 0.32, 1.275] as const,
  sharp: [0.4, 0.0, 0.2, 1] as const,
  gentle: [0.25, 0.46, 0.45, 0.94] as const,
} as const

// Premium Durations
export const premiumDurations = {
  instant: 0.15,
  fast: 0.2,
  normal: 0.3,
  slow: 0.6,
  dramatic: 1.0,
} as const

// Premium Colors (HSL format for CSS variables)
export const premiumColors = {
  // Primary gradients for buttons and CTAs
  gradients: {
    // Gradientes otimizados para performance
    primary: "linear-gradient(135deg, rgb(59, 130, 246), rgb(99, 102, 241))",
    secondary: "linear-gradient(135deg, rgb(16, 185, 129), rgb(34, 197, 94))",
    accent: "linear-gradient(135deg, rgb(245, 158, 11), rgb(251, 191, 36))",
    danger: "linear-gradient(135deg, rgb(239, 68, 68), rgb(248, 113, 113))",
    
    // Versões mobile-optimized (só 2 cores)
    mobile: {
      primary: "linear-gradient(135deg, rgb(59, 130, 246), rgb(99, 102, 241))",
      secondary: "linear-gradient(135deg, rgb(16, 185, 129), rgb(34, 197, 94))",
      accent: "linear-gradient(135deg, rgb(245, 158, 11), rgb(251, 191, 36))",
      danger: "linear-gradient(135deg, rgb(239, 68, 68), rgb(248, 113, 113))",
    },
    
    // Fallbacks sólidos para dispositivos lentos
    solid: {
      primary: "rgb(99, 102, 241)",
      secondary: "rgb(34, 197, 94)",
      accent: "rgb(251, 191, 36)",
      danger: "rgb(248, 113, 113)",
    },
  },
  
  // Shadows with premium feel
  shadows: {
    subtle: "0 1px 2px rgba(0, 0, 0, 0.02), 0 1px 1px rgba(0, 0, 0, 0.01)",
    medium: "0 2px 4px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
    large: "0 8px 16px rgba(0, 0, 0, 0.06), 0 4px 8px rgba(0, 0, 0, 0.02)",
    premium: "0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.06)",
  },
  
  // Glass morphism effects
  glass: {
    light: "rgba(255, 255, 255, 0.85)",
    medium: "rgba(255, 255, 255, 0.75)",
    dark: "rgba(17, 25, 40, 0.85)",
  },
} as const

// Premium Spacing Scale (based on 8px grid)
export const premiumSpacing = {
  xs: "0.25rem",    // 4px
  sm: "0.5rem",     // 8px
  md: "1rem",       // 16px
  lg: "1.5rem",     // 24px
  xl: "2rem",       // 32px
  "2xl": "3rem",    // 48px
  "3xl": "4rem",    // 64px
  "4xl": "6rem",    // 96px
} as const

// Premium Typography Scale
export const premiumTypography = {
  // Font sizes with optimal line heights
  sizes: {
    xs: { fontSize: "0.75rem", lineHeight: "1.5" },
    sm: { fontSize: "0.875rem", lineHeight: "1.5" },
    base: { fontSize: "1rem", lineHeight: "1.65" },      // Optimized for reading
    lg: { fontSize: "1.125rem", lineHeight: "1.7" },
    xl: { fontSize: "1.25rem", lineHeight: "1.3" },
    "2xl": { fontSize: "1.5rem", lineHeight: "1.2" },
    "3xl": { fontSize: "1.875rem", lineHeight: "1.2" },
    "4xl": { fontSize: "2.25rem", lineHeight: "1.1" },
    "5xl": { fontSize: "3rem", lineHeight: "1.1" },
    "6xl": { fontSize: "3.75rem", lineHeight: "1" },
  },
  
  // Letter spacing for professional feel
  tracking: {
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
  },
  
  // Font weights
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const

// Premium Border Radius
export const premiumBorderRadius = {
  none: "0",
  sm: "0.125rem",   // 2px
  base: "0.25rem",  // 4px
  md: "0.375rem",   // 6px
  lg: "0.5rem",     // 8px
  xl: "0.75rem",    // 12px
  "2xl": "1rem",    // 16px
  "3xl": "1.5rem",  // 24px
  full: "9999px",
} as const

// Breakpoints for responsive design
export const premiumBreakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const

// Z-index scale
export const premiumZIndex = {
  hide: -1,
  auto: "auto",
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const

// Premium Component Variants
export const premiumVariants = {
  button: {
    default: {
      background: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      hover: "hsl(var(--primary)/0.9)",
    },
    premium: {
      background: premiumColors.gradients.primary,
      color: "white",
      shadow: premiumColors.shadows.medium,
      hoverShadow: premiumColors.shadows.large,
      transform: "translateY(-1px) scale(1.02)",
    },
    secondary: {
      background: "hsl(var(--secondary))",
      color: "hsl(var(--secondary-foreground))",
      hover: "hsl(var(--secondary)/0.8)",
    },
  },
  
  card: {
    default: {
      background: "hsl(var(--card))",
      border: "hsl(var(--border))",
      shadow: premiumColors.shadows.subtle,
    },
    premium: {
      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8))",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      shadow: premiumColors.shadows.medium,
      backdropFilter: "blur(16px)",
      hoverShadow: premiumColors.shadows.large,
      hoverTransform: "translateY(-2px) scale(1.02)",
    },
    elevated: {
      background: "hsl(var(--card))",
      border: "hsl(var(--border))",
      shadow: premiumColors.shadows.large,
      hoverTransform: "translateY(-1px)",
    },
  },
} as const

// Export all tokens as a single object for easy consumption
export const designTokens = {
  easings: premiumEasings,
  durations: premiumDurations,
  colors: premiumColors,
  spacing: premiumSpacing,
  typography: premiumTypography,
  borderRadius: premiumBorderRadius,
  breakpoints: premiumBreakpoints,
  zIndex: premiumZIndex,
  variants: premiumVariants,
} as const

export type DesignTokens = typeof designTokens
export type PremiumEasing = keyof typeof premiumEasings
export type PremiumDuration = keyof typeof premiumDurations
export type PremiumSpacing = keyof typeof premiumSpacing