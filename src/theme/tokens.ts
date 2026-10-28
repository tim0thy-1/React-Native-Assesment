/**
 * Design Tokens for ShopLite
 *
 * Requirements:
 * - Primary: #4F46E5
 * - Background: #F8F9FB
 * - Text: #111827
 * - Muted text: #6B7280
 * - Success: #16A34A
 * - Warning / rating: #F59E0B
 * - Danger: #DC2626
 * - Border / skeleton: #E5E7EB
 * - Spacing scale: 4, 8, 12, 16, 24
 * - Radius: Cards 12, buttons 10, chips and pills full
 * - Font sizes: Title 24, heading 18, body 14, caption 12
 * - Touch targets: At least 44 x 44
 * Store the tokens in a single theme file and use them everywhere.
 * No hard-coded colors inside components.
 */

export const tokens = {
  colors: {
    primary: '#4F46E5',
    background: '#F8F9FB',
    text: '#111827',
    mutedText: '#6B7280',
    success: '#16A34A',
    warning: '#F59E0B',
    danger: '#DC2626',
    border: '#E5E7EB',
    white: '#FFFFFF',
    // Component-specific token derivations
    cardBackground: '#FFFFFF',
    skeletonBackground: '#E5E7EB',
    skeletonHighlight: '#F3F4F6',
    chipActiveBackground: '#4F46E5',
    chipActiveText: '#FFFFFF',
    chipInactiveBackground: '#FFFFFF',
    chipInactiveText: '#6B7280',
    chipInactiveBorder: '#E5E7EB',
    snackbarBackground: '#1F2937',
    snackbarText: '#F9FAFB',
    offlineBannerBackground: '#FEF3C7',
    offlineBannerText: '#92400E',
    offlineBannerBorder: '#FDE68A',
    ratingStar: '#F59E0B',
    stockInStock: '#16A34A',
    stockLowStock: '#F59E0B',
    stockOutOfStock: '#DC2626',
    tabActive: '#4F46E5',
    tabInactive: '#6B7280',
    badgeBackground: '#DC2626',
    badgeText: '#FFFFFF',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  radius: {
    card: 12,
    button: 10,
    full: 9999,
    thumbnail: 8,
    chip: 9999,
  },
  typography: {
    title: {
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: '32px',
    },
    heading: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: '26px',
    },
    body: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: '20px',
    },
    bodyBold: {
      fontSize: 14,
      fontWeight: '600' as const,
      lineHeight: '20px',
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: '16px',
    },
    captionBold: {
      fontSize: 12,
      fontWeight: '600' as const,
      lineHeight: '16px',
    },
  },
  touchTarget: {
    minHeight: 44,
    minWidth: 44,
  },
} as const;

export type ThemeTokens = typeof tokens;
