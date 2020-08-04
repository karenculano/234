/*
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
*/

'use strict';

require('core-js/features/array/flat-map');

const { reporter } = require('@carbon/cli-reporter');
const { types: t, generate } = require('@carbon/scss-generator');
const fs = require('fs-extra');
const path = require('path');
const {
  container,
  iconSize,
  spacing,
  layout,
  fluidSpacing,
} = require('../lib');

async function build() {
  reporter.info('Building scss files for layout...');

  const SCSS_DIR = path.resolve(__dirname, '../scss/generated');
  const files = [
    {
      filepath: path.join(SCSS_DIR, '_spacing.scss'),
      builder() {
        return buildTokenFile(spacing, 'spacing');
      },
    },
    {
      filepath: path.join(SCSS_DIR, '_fluid-spacing.scss'),
      builder() {
        return buildTokenFile(fluidSpacing, 'fluid-spacing');
      },
    },
    {
      filepath: path.join(SCSS_DIR, '_layout.scss'),
      builder() {
        return buildTokenFile(layout, 'layout');
      },
    },
    {
      filepath: path.join(SCSS_DIR, '_container.scss'),
      builder() {
        return buildTokenFile(container, 'container');
      },
    },
    {
      filepath: path.join(SCSS_DIR, '_icon-size.scss'),
      builder() {
        return buildTokenFile(iconSize, 'icon-size');
      },
    },
  ];

  await fs.ensureDir(SCSS_DIR);
  for (const { filepath, builder } of files) {
    const { code } = generate(builder());
    await fs.writeFile(filepath, code);
  }

  reporter.success('Done! 🎉');
}

/**
 * Build a token stylesheet for a given token scale and group. This will help
 * generate the initial collection of tokens and a list of all tokens. In
 * addition, it will generate aliases for these tokens.
 *
 * @param {Array} tokenScale
 * @param {string} group
 * @returns {StyleSheet}
 */
function buildTokenFile(tokenScale, group) {
  const FILE_BANNER = t.Comment(` Code generated by @carbon/layout. DO NOT EDIT.

 Copyright IBM Corp. 2018, 2019

 This source code is licensed under the Apache-2.0 license found in the
 LICENSE file in the root directory of this source tree.
`);

  const values = tokenScale.map((value, index) => {
    const name = formatStep(`carbon--${group}`, index + 1);
    const shorthand = formatStep(group, index + 1);
    const id = t.Identifier(name);
    return [
      name,
      shorthand,
      id,
      t.Assignment({
        id,
        init: t.SassValue(value),
        default: true,
      }),
    ];
  });

  const variables = values.flatMap(([_name, _shorthand, _id, assignment]) => {
    const comment = t.Comment(`/ @type Number
/ @access public
/ @group @carbon/layout`);
    return [comment, assignment, t.Newline()];
  });

  const list = [
    t.Comment(`/ @type List
/ @access public
/ @group @carbon/layout`),
    t.Assignment({
      id: t.Identifier(`carbon--${group}`),
      init: t.SassList({
        elements: values.map(([_name, _shorthand, id]) => {
          return id;
        }),
      }),
    }),
  ];

  const aliases = values.flatMap(([name, shorthand, id]) => {
    const comment = t.Comment(`/ @type Number
/ @access public
/ @group @carbon/layout
/ @alias ${name}`);
    return [
      comment,
      t.Assignment({
        id: t.Identifier(shorthand),
        init: id,
        default: true,
      }),
      t.Newline(),
    ];
  });

  return t.StyleSheet([
    FILE_BANNER,
    t.Newline(),
    ...variables,
    ...list,
    t.Newline(),
    ...aliases,
  ]);
}

/**
 * Format the given step for a token name. Most often, this is to pad a `0` for
 * numbers that are less than 10. For example, instead of spacing-1 we would
 * want spacing-01
 *
 * @param {string} name
 * @param {number} index
 * @returns {string}
 */
function formatStep(name, index) {
  let step = index;
  if (step < 10) {
    step = '0' + step;
  }
  return `${name}-${step}`;
}

build().catch((error) => {
  console.log(error);
  process.exit(1);
});
