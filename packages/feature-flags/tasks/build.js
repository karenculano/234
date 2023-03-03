/**
 * Copyright IBM Corp. 2015, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { default: babelGenerate } = require('@babel/generator');
const { default: template } = require('@babel/template');
const babelTypes = require('@babel/types');
const { types: t, generate } = require('@carbon/scss-generator');
const { camelCase, constantCase } = require('change-case');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const path = require('path');

async function main() {
  const featureFlagsPath = path.resolve(__dirname, '../feature-flags.yml');
  const { 'feature-flags': featureFlags } = yaml.safeLoad(
    await fs.readFile(featureFlagsPath, 'utf8')
  );

  const generatedJavaScriptFilepath = path.resolve(
    __dirname,
    '../src/generated/feature-flags.js'
  );
  await fs.ensureFile(generatedJavaScriptFilepath);
  await fs.writeFile(
    generatedJavaScriptFilepath,
    buildJavaScriptModule(featureFlags)
  );

  const generatedSassFilepath = path.resolve(
    __dirname,
    '../scss/generated/feature-flags.scss'
  );
  await fs.ensureFile(generatedSassFilepath);
  await fs.writeFile(generatedSassFilepath, buildSassModule(featureFlags));
}

const sassBanner = ` Code generated by @carbon/feature-flags. DO NOT EDIT.

 Copyright IBM Corp. 2015, 2023

 This source code is licensed under the Apache-2.0 license found in the
 LICENSE file in the root directory of this source tree.
`;
function buildSassModule(featureFlags) {
  const stylesheet = t.StyleSheet([
    t.Comment(sassBanner),
    t.Newline(),
    t.Assignment({
      id: t.Identifier('generated-feature-flags'),
      init: t.SassMap(
        featureFlags.map((featureFlag) => {
          return t.SassMapProperty(
            t.Identifier(featureFlag.name),
            t.SassBoolean(featureFlag.enabled),
            true
          );
        })
      ),
    }),
  ]);
  const { code } = generate(stylesheet);
  return code;
}

const javascriptBanner = `/**
 * Code generated by @carbon/feature-flags. DO NOT EDIT.
 *
 * Copyright IBM Corp. 2015, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
`;
function buildJavaScriptModule(featureFlags) {
  const t = babelTypes;
  const tmpl = template(`
    if (process.env.%%env%%) {
      if (process.env.%%env%% === 'true') {
        enabled.%%key%% = true;
      } else {
        enabled.%%key%% = false;
      }
    } else {
      enabled.%%key%% = %%defaultEnabled%%;
    }
  `);
  const fallback = template(`enabled.%%key%% = %%enabled%%;`);

  const file = t.file(
    t.program([
      t.variableDeclaration('const', [
        t.variableDeclarator(t.identifier('enabled'), t.objectExpression([])),
      ]),
      t.tryStatement(
        t.blockStatement(
          featureFlags.flatMap((featureFlag) => {
            return tmpl({
              env: t.identifier(constantCase(`CARBON_${featureFlag.name}`)),
              key: t.identifier(camelCase(featureFlag.name)),
              defaultEnabled: t.booleanLiteral(featureFlag.enabled),
            });
          })
        ),
        t.catchClause(
          t.identifier('error'),
          t.blockStatement(
            featureFlags.flatMap((featureFlag) => {
              return fallback({
                key: t.identifier(camelCase(featureFlag.name)),
                enabled: t.booleanLiteral(featureFlag.enabled),
              });
            })
          )
        )
      ),
      t.exportNamedDeclaration(
        t.variableDeclaration('const', [
          t.variableDeclarator(
            t.identifier('featureFlagInfo'),
            t.arrayExpression(
              featureFlags.map((featureFlag) => {
                return t.objectExpression([
                  t.objectProperty(
                    t.identifier('name'),
                    t.stringLiteral(featureFlag.name)
                  ),
                  t.objectProperty(
                    t.identifier('description'),
                    t.stringLiteral(featureFlag.description)
                  ),
                  t.objectProperty(
                    t.identifier('enabled'),
                    t.memberExpression(
                      t.identifier('enabled'),
                      t.identifier(camelCase(featureFlag.name))
                    )
                  ),
                ]);
              })
            )
          ),
        ])
      ),
    ])
  );
  const { code } = babelGenerate(file);

  return `${javascriptBanner}${code}`;
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
