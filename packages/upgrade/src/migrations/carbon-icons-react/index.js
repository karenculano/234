/*
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
*/

'use strict';

const migrations = new Set([require('./10.3.0')]);

module.exports = {
  name: '@carbon/icons-react',
  migrations,
};
