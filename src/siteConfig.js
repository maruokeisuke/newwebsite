export const DESKTOP_MEDIA_QUERY = '(min-width: 64rem)';

export const SLIDES = Object.freeze({
  hero: 0,
  vision: 1,
  profile: 2,
  policyStart: 3,
  policyEnd: 7,
  support: 8,
});

export const SLIDE_COUNT = 9;
export const MAX_TRACK_SHIFT = ((SLIDE_COUNT - 1) / SLIDE_COUNT) * 100;

export const POLICY_PALETTE = [
  [9, 37, 75],
  [7, 58, 95],
  [13, 78, 96],
  [18, 88, 82],
  [53, 70, 102],
];

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
