/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { test } = require('@playwright/test');
const { themes } = require('../../test-utils/env');
const { snapshotStory } = require('../../test-utils/storybook');

test.describe('Theme', () => {
  themes.forEach((theme) => {
    test.describe(theme, () => {
      test('default @vrt', async ({ page }) => {
        await snapshotStory(page, {
          component: 'Theme',
          id: 'components-theme--default',
          theme,
        });
      });

      test('usetheme @vrt', async ({ page }) => {
        await snapshotStory(page, {
          component: 'Theme',
          id: 'components-theme--use-theme',
          theme,
        });
      });

      test('with layer @vrt', async ({ page }) => {
        await snapshotStory(page, {
          component: 'Theme',
          id: 'components-theme--with-layer',
          theme,
        });
      });
    });
  });
});
