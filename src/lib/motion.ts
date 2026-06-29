export const motionTokens = {
  duration: {
    fast: 0.14,
    normal: 0.22,
    slow: 0.42,
  },
  easing: {
    standard: [0.22, 1, 0.36, 1],
    gentle: [0.16, 1, 0.3, 1],
  },
  distance: {
    lift: -4,
    small: 8,
    section: 20,
  },
} as const;
