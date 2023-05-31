/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useRef } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { AriaLabelPropType } from '../../prop-types/AriaPropTypes';
import { usePrefix } from '../../internal/usePrefix';

const Switcher = React.forwardRef(function Switcher(props, ref) {
  const switcherRef = useRef(null);

  const prefix = usePrefix();
  const {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    className: customClassName,
    children,
  } = props;

  const accessibilityLabel = {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
  };

  const className = cx(`${prefix}--switcher`, {
    [customClassName]: !!customClassName,
  });

  const handleSwitcherItemFocus = ({ currentIndex, direction }) => {
    const enabledIndices = React.Children.toArray(children).reduce(
      (acc, curr, i) => {
        if (Object.keys(curr.props).length !== 0) {
          acc.push(i);
        }

        return acc;
      },
      []
    );

    const nextValidIndex = (() => {
      const nextIndex = enabledIndices.indexOf(currentIndex) + direction;

      switch (enabledIndices[nextIndex]) {
        case undefined:
          if (direction === -1) {
            return enabledIndices[enabledIndices.length - 1];
          }
          return 0;
        default:
          return enabledIndices[nextIndex];
      }
    })();

    const switcherItem =
      switcherRef.current.children[nextValidIndex].children[0];
    switcherItem?.focus();
  };

  const childrenWithProps = React.Children.toArray(children).map(
    (child, index) =>
      React.cloneElement(child, {
        handleSwitcherItemFocus,
        ref,
        index,
      })
  );

  return (
    <ul ref={switcherRef} className={className} {...accessibilityLabel}>
      {childrenWithProps}
    </ul>
  );
});

Switcher.displayName = 'Switcher';
Switcher.propTypes = {
  /**
   * Required props for accessibility label on the underlying menu
   */
  ...AriaLabelPropType,

  /**
   * expects to receive <SwitcherItem />
   */
  children: PropTypes.node.isRequired,

  /**
   * Optionally provide a custom class to apply to the underlying `<ul>` node
   */
  className: PropTypes.string,
};

export default Switcher;
