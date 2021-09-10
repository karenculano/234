/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { babel } = require('@rollup/plugin-babel');
const path = require('path');
const { rollup } = require('rollup');
const virtual = require('./plugins/virtual');

const BANNER = `/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Code generated by @carbon/icon-build-helpers. DO NOT EDIT.
 */`;

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
  babelHelpers: 'bundled',
};

async function builder(metadata, { output }) {
  const modules = metadata.icons.flatMap((icon) => {
    return icon.output.map((size) => {
      const source = `export default ${JSON.stringify(size.descriptor)};`;
      return {
        source,
        filepath: size.filepath,
        moduleName: size.moduleName,
      };
    });
  });

  const files = {
    'index.js': `${BANNER}\n\n`,
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
      exports: 'auto',
    };

    await bundle.write(outputOptions);
  }

  const umd = await rollup({
    input: 'index.js',
    plugins: [virtual(files), babel(babelConfig)],
  });

  await umd.write({
    file: path.join(output, 'umd/index.js'),
    format: 'umd',
    name: 'CarbonIcons',
  });
}

module.exports = builder;
