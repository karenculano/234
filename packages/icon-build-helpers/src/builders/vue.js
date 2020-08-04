/*
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
*/

'use strict';

const path = require('path');
const { rollup } = require('rollup');
const babel = require('rollup-plugin-babel');
const virtual = require('./plugins/virtual');

const BANNER = `/**
 * Copyright IBM Corp. 2019, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Code generated by @carbon/icon-build-helpers. DO NOT EDIT.
 */`;
const external = ['@carbon/icon-helpers'];
const babelConfig = {
  babelrc: false,
  exclude: /node_modules/,
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['extends browserslist-config-carbon'],
        },
      },
    ],
  ],
};

async function builder(metadata, { output }) {
  const modules = metadata.icons.flatMap((icon) => {
    return icon.output.map((size) => {
      const source = createIconComponent(size.moduleName, size.descriptor);
      return {
        source,
        filepath: size.filepath,
        moduleName: size.moduleName,
      };
    });
  });

  const files = {
    'index.js': `${BANNER}\n\n
      export const CarbonIconsVue = {
        install(Vue, options) {
          const { components } = options;
          Object.keys(components).forEach(key => {
            Vue.component(key, components[key]);
          });
        },
      };
    `,
  };
  const input = {
    'index.js': 'index.js',
  };

  for (const m of modules) {
    files[m.filepath] = m.source;
    input[m.filepath] = m.filepath;
    files[
      'index.js'
    ] += `\nexport { default as ${m.moduleName} } from '${m.filepath}';`;
  }

  const bundle = await rollup({
    input,
    external,
    plugins: [virtual(files), babel(babelConfig)],
  });

  const bundles = [
    {
      directory: path.join(output, 'es'),
      format: 'esm',
    },
    {
      directory: path.join(output, 'lib'),
      format: 'commonjs',
    },
  ];

  for (const { directory, format } of bundles) {
    const outputOptions = {
      dir: directory,
      format,
      entryFileNames: '[name]',
      banner: BANNER,
    };

    await bundle.write(outputOptions);
  }

  const umd = await rollup({
    input: 'index.js',
    external,
    plugins: [virtual(files), babel(babelConfig)],
  });

  await umd.write({
    file: path.join(output, 'umd/index.js'),
    format: 'umd',
    name: 'CarbonIconsVue',
    globals: {
      '@carbon/icon-helpers': 'CarbonIconHelpers',
    },
  });
}

/**
 * Generate an icon component, which in our case is the string representation
 * of the component, from a given moduleName and icon descriptor.
 * @param {string} moduleName
 * @param {object} descriptor
 * @returns {object}
 */
function createIconComponent(moduleName, descriptor) {
  const { attrs, content } = descriptor;
  const attrsAsString = Object.keys(attrs)
    .map((attr) => `${attr}: "${attrs[attr]}"`)
    .join(',');
  const source = `${BANNER}
import { getAttributes } from '@carbon/icon-helpers';
export default {
  name: '${moduleName}',
  functional: true,
  // We use title as the prop name as it is not a valid attribute for an SVG
  // HTML element
  props: ['title'],
  render(createElement, context) {
    const { children, data, listeners, props } = context;
    const attrs = getAttributes({
      ${attrsAsString},
      preserveAspectRatio: 'xMidYMid meet',
      xmlns: 'http://www.w3.org/2000/svg',
      // Special case here, we need to coordinate that we are using title,
      // potentially, to get the right focus attributes
      title: props.title,
      ...data.attrs
    });
    const svgData = {
      attrs,
      on: listeners,
    };
    if (data.staticClass) {
      svgData.class = {
        [data.staticClass]: true,
      };
    }
    if (data.class) {
      svgData.class = svgData.class || {}; // may be no static class
      svgData.class[data.class] = true;
    }
    // remove style set by getAttributes
    delete svgData.attrs.style;
    // combine incoming staticStyle, style with default willChange
    svgData.style = { ...data.staticStyle, ...data.style };
    return createElement('svg', svgData, [
      props.title && createElement('title', null, props.title),
      ${content.map(convertToVue).join(', ')},
      children,
    ]);
  },
};`;

  return source;
}

/**
 * Convert the given node to a Vue string source
 * @param {object} node
 * @returns {string}
 */
function convertToVue(node) {
  const { elem, attrs } = node;
  return `createElement('${elem}', { attrs: ${JSON.stringify(attrs)} })`;
}

module.exports = builder;
