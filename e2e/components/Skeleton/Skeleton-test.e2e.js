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

test.describe('Skeleton', () => {
  themes.forEach((theme) => {
    test.describe(theme, () => {
      test('skeletonicon - default @vrt', async ({ page }) => {
        await snapshotStory(page, {
          component: 'Skeleton',
          id: 'components-skeleton-skeletonicon--default',
          theme,
        });
      });

      test('skeletonplaceholder - default @vrt', async ({ page }) => {
        await snapshotStory(page, {
          component: 'Skeleton',
          id: 'components-skeleton-skeletonplaceholder--default',
          theme,
        });
      });

      test('skeletontext - default @vrt', async ({ page }) => {
        await snapshotStory(page, {
          component: 'Skeleton',
          id: 'components-skeleton-skeletontext--default',
          theme,
        });
      });
    });
  });
});
