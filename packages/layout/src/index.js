/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Convert
// Default, Use with em() and rem() functions
export const baseFontSize = 16;

/**
 * Convert a given px unit to a rem unit
 * @param {number} px
 * @return {string}
 */
export function rem(px) {
  return `${px / baseFontSize}rem`;
}

/**
 * Convert a given px unit to a em unit
 * @param {number} px
 * @return {string}
 */
export function em(px) {
  return `${px / baseFontSize}em`;
}

/**
 * Convert a given px unit to its string representation
 * @param {number} value - number of pixels
 * @return {string}
 */
export function px(value) {
  return `${value}px`;
}

// Breakpoint
// Initial map of our breakpoints and their values
export const breakpoints = {
  sm: {
    width: rem(320),
    columns: 4,
    margin: '0',
  },
  md: {
    width: rem(672),
    columns: 8,
    margin: rem(16),
  },
  lg: {
    width: rem(1056),
    columns: 16,
    margin: rem(16),
  },
  xlg: {
    width: rem(1312),
    columns: 16,
    margin: rem(16),
  },
  max: {
    width: rem(1584),
    columns: 16,
    margin: rem(16),
  },
};

export function breakpointUp(name) {
  return `@media (min-width: ${breakpoints[name].width})`;
}

export function breakpointDown(name) {
  return `@media (max-width: ${breakpoints[name].width})`;
}

export function breakpoint(...args) {
  return breakpointUp(...args);
}

// Mini-unit
export const miniUnit = 8;

export function miniUnits(count) {
  return rem(miniUnit * count);
}

// Spacing
export const spacing01 = miniUnits(0.25);
export const spacing02 = miniUnits(0.5);
export const spacing03 = miniUnits(1);
export const spacing04 = miniUnits(1.5);
export const spacing05 = miniUnits(2);
export const spacing06 = miniUnits(3);
export const spacing07 = miniUnits(4);
export const spacing08 = miniUnits(5);
export const spacing09 = miniUnits(6);
export const spacing10 = miniUnits(8);
export const spacing11 = miniUnits(10);
export const spacing12 = miniUnits(12);
export const spacing = [
  spacing01,
  spacing02,
  spacing03,
  spacing04,
  spacing05,
  spacing06,
  spacing07,
  spacing08,
  spacing09,
  spacing10,
  spacing11,
  spacing12,
];

// Layout
export const layout01 = miniUnits(2);
export const layout02 = miniUnits(3);
export const layout03 = miniUnits(4);
export const layout04 = miniUnits(6);
export const layout05 = miniUnits(8);
export const layout06 = miniUnits(12);
export const layout07 = miniUnits(20);
export const layout = [
  layout01,
  layout02,
  layout03,
  layout04,
  layout05,
  layout06,
  layout07,
];
