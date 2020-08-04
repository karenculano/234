/*
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
*/

import React from 'react';
import { mount } from 'enzyme';
import { Table, TableBody } from '../';

describe('DataTable.TableBody', () => {
  it('should render', () => {
    const wrapper = mount(
      <Table>
        <TableBody className="custom-class" />
      </Table>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
