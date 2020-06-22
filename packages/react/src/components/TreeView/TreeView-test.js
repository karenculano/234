/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import { Document16, Folder16 } from '@carbon/icons-react';
import { settings } from 'carbon-components';
import TreeView, { TreeNode } from './';

const { prefix } = settings;

describe('TreeView', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <TreeView label="Tree view" selected={['1']}>
        <TreeNode value="1" label="1" />
        <TreeNode value="2" label="2" />
        <TreeNode value="5" label="5" isExpanded>
          <TreeNode value="5-1" label="5-1" />
          <TreeNode value="5-2" label="5-2" />
          <TreeNode value="5-3" label="5-3" isExpanded>
            <TreeNode value="5-4" label="5-4" />
          </TreeNode>
        </TreeNode>
      </TreeView>
    );
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with icons', () => {
    wrapper = mount(
      <TreeView label="Tree view" selected={['1']}>
        <TreeNode renderIcon={Document16} value="1" label="1" />
        <TreeNode renderIcon={Document16} value="2" label="2" />
        <TreeNode renderIcon={Folder16} value="5" label="5" isExpanded>
          <TreeNode renderIcon={Document16} value="5-1" label="5-1" />
          <TreeNode renderIcon={Document16} value="5-2" label="5-2" />
          <TreeNode renderIcon={Folder16} value="5-3" label="5-3" isExpanded>
            <TreeNode renderIcon={Document16} value="5-4" label="5-4" />
          </TreeNode>
        </TreeNode>
      </TreeView>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should be able to hide the label', () => {
    expect(wrapper.find('TreeLabel').text()).toBe('Tree view');
    wrapper.setProps({ hideLabel: true });
    expect(wrapper.find('TreeLabel').text()).toBeFalsy();
  });

  describe('Single node selection', () => {
    it('should be able to preselect a node', () => {
      expect(wrapper.find(`.${prefix}--tree-node--selected`).text()).toBe('1');
    });

    it('should handle selection at the tree level', () => {
      const onTreeSelect = jest.fn();
      wrapper.setProps({ onSelect: onTreeSelect });
      wrapper.find('TreeNode[value="2"]').simulate('click');
      expect(onTreeSelect).toHaveBeenCalledTimes(1);
    });

    it('should handle selection at the node level', () => {
      const onTreeSelect = jest.fn();
      const onNodeSelect = jest.fn();
      wrapper = mount(
        <TreeView label="Tree view" selected={['1']} onSelect={onTreeSelect}>
          <TreeNode value="1" label="1" />
          <TreeNode value="2" label="2" onSelect={onNodeSelect} />
          <TreeNode value="5" label="5" isExpanded>
            <TreeNode value="5-1" label="5-1" />
            <TreeNode value="5-2" label="5-2" />
            <TreeNode value="5-3" label="5-3" isExpanded>
              <TreeNode value="5-4" label="5-4" />
            </TreeNode>
          </TreeNode>
        </TreeView>
      );
      wrapper.find('TreeNode[value="2"]').simulate('click');
      expect(onTreeSelect).toHaveBeenCalledTimes(1);
      expect(onNodeSelect).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tree node expansion', () => {
    it('Caret icon should not render in leaf nodes', () => {
      wrapper = mount(
        <TreeView label="Tree view">
          <TreeNode value="1" label="1" />
          <TreeNode value="2" label="2" />
          <TreeNode value="5" label="5" isExpanded>
            <TreeNode value="5-1" label="5-1" />
          </TreeNode>
        </TreeView>
      );
      expect(wrapper.find('ForwardRef(CaretDown16)').length).toBe(1);
    });
  });
});
