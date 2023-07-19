/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { expect, test } = require('@playwright/test');
const { visitStory } = require('../../test-utils/storybook');

test.describe('Slider @avt', () => {
  test('accessibility-checker @avt - Slider default state', async ({
    page,
  }) => {
    await visitStory(page, {
      component: 'Slider',
      id: 'components-slider--default',
      globals: {
        theme: 'white',
      },
    });
    await expect(page).toHaveNoACViolations('Slider');
  });

  test('accessibility-checker controlled slider', async ({ page }) => {
    await visitStory(page, {
      component: 'Slider',
      id: 'components-slider--controlled-slider',
      globals: {
        theme: 'white',
      },
    });
    await expect(page).toHaveNoACViolations('Slider-controlled');
  });

  test('accessibility-checker controlled slider with layer', async ({
    page,
  }) => {
    await visitStory(page, {
      component: 'Slider',
      id: 'components-slider--controlled-slider-with-layer',
      globals: {
        theme: 'white',
      },
    });
    await expect(page).toHaveNoACViolations(
      'Slider-controlled-slider-with-layer'
    );
  });

  test('accessibility-checker skeleton', async ({ page }) => {
    await visitStory(page, {
      component: 'Slider',
      id: 'components-slider--skeleton',
      globals: {
        theme: 'white',
      },
    });
    await expect(page).toHaveNoACViolations('Slider-skeleton');
  });

  test('accessibility-checker slider with layer', async ({ page }) => {
    await visitStory(page, {
      component: 'Slider',
      id: 'components-slider--with-layer',
      globals: {
        theme: 'white',
      },
    });
    await expect(page).toHaveNoACViolations('Slider-with-layer');
  });

  test('default state - keyboard nav', async ({ page }) => {
    await visitStory(page, {
      component: 'Slider',
      id: 'components-slider--default',
      globals: {
        theme: 'white',
      },
    });

    // Focus on the slider via keyboard navigation
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('slider', { name: 'Slider Label' })
    ).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('slider', { name: 'Slider Label' })
    ).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('slider-input-id')).toBeFocused();

    await page.keyboard.insertText('20');
    await expect(page.getByTestId('slider-input-id')).toHaveValue('20');
  });
});
