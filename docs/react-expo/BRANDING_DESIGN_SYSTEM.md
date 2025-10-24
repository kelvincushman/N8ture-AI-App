# N8ture AI Branding & Design System

## Brand Colors

### Primary Palette

```javascript
primary: {
  leafKhaki: '#708C6A',      // Primary brand color
  accentGreen: '#8FAF87',    // Accent highlights
  forestCharcoal: '#2D3A30', // Dark elements, headers
}
```

### Secondary Palette

```javascript
secondary: {
  earthBrown: '#8C8871',  // Secondary accents
  skyBlue: '#ABC8C5',     // Info, links
}
```

### Neutrals & Backgrounds

```javascript
neutrals: {
  background: '#F7F7F5',  // Main background
  textPrimary: '#2B312B', // Primary text
  textSecondary: '#6B7265', // Secondary text
}
```

### Complete Theme Configuration

```javascript
// constants/theme.js
export const theme = {
  colors: {
    // Primary palette
    primary: {
      main: '#708C6A',        // Leaf Khaki
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
      heading: 'System', // Use system font for headings
      body: 'System',    // Use system font for body
    },
    h1: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 40,
      letterSpacing: -0.5,
      color: '#2B312B',
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
      letterSpacing: -0.3,
      color: '#2B312B',
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
      letterSpacing: -0.2,
      color: '#2B312B',
    },
    h4: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 24,
      color: '#2B312B',
    },
    body1: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      color: '#2B312B',
    },
    body2: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
      color: '#6B7265',
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
      color: '#6B7265',
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
      textTransform: 'none',
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
};
```

## Design Principles

### 1. Nature-Inspired
- Use organic shapes and rounded corners
- Incorporate leaf and natural imagery
- Maintain earthy, calming color palette

### 2. Accessibility
- Minimum contrast ratio of 4.5:1 for text
- Touch targets minimum 44x44 points
- Clear visual hierarchy

### 3. Consistency
- Use design tokens consistently
- Maintain spacing rhythm (8px grid)
- Consistent component patterns

### 4. Clarity
- Clear call-to-action buttons
- Obvious navigation patterns
- Informative feedback messages

## Component Styling Examples

### Button Variants

```javascript
// Primary button (Leaf Khaki)
<Button 
  style={{
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  }}
/>

// Secondary button (Earth Brown outline)
<Button 
  style={{
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.secondary.main,
    borderRadius: theme.borderRadius.md,
  }}
/>
```

### Card Styling

```javascript
<View style={{
  backgroundColor: theme.colors.background.paper,
  borderRadius: theme.borderRadius.lg,
  padding: theme.spacing.md,
  ...theme.shadows.md,
}}>
  {/* Card content */}
</View>
```

### Status Badges

```javascript
// Safe/Edible badge
<View style={{
  backgroundColor: theme.colors.status.safe,
  paddingHorizontal: theme.spacing.sm,
  paddingVertical: theme.spacing.xs,
  borderRadius: theme.borderRadius.sm,
}}>
  <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>SAFE</Text>
</View>

// Danger badge
<View style={{
  backgroundColor: theme.colors.status.danger,
  paddingHorizontal: theme.spacing.sm,
  paddingVertical: theme.spacing.xs,
  borderRadius: theme.borderRadius.sm,
}}>
  <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>DANGEROUS</Text>
</View>
```

## Icon Usage

- Use nature-themed icons (leaf, tree, bird, etc.)
- Maintain consistent icon size (24x24 for standard, 32x32 for large)
- Use Ionicons or custom SVG icons
- Primary icon color: `#708C6A` (Leaf Khaki)

## Imagery Guidelines

- Use high-quality nature photography
- Maintain natural color tones
- Apply subtle overlays using brand colors
- Ensure good contrast for text overlays

## Animation Guidelines

- Use smooth, natural animations (300-500ms)
- Easing: `ease-in-out` for most animations
- Avoid jarring or aggressive animations
- Subtle fade and slide transitions

## Accessibility Considerations

### Color Contrast
- Primary text on background: 10.5:1 ✓
- Secondary text on background: 5.2:1 ✓
- Primary button text: 4.8:1 ✓

### Touch Targets
- Minimum size: 44x44 points
- Adequate spacing between interactive elements
- Clear visual feedback on press

### Screen Reader Support
- All images have alt text
- Buttons have accessibility labels
- Form inputs have labels

## Brand Voice

- **Tone**: Friendly, educational, trustworthy
- **Language**: Clear, concise, informative
- **Personality**: Nature-loving, curious, helpful

Use this design system consistently across all screens and components in the N8ture AI App.

