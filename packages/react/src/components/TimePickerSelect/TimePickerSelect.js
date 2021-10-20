/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { ChevronDown16 } from '@carbon/icons-react';
import { settings } from 'carbon-components';
import deprecate from '../../prop-types/deprecate';

const { prefix } = settings;

export default class TimePickerSelect extends Component {
  static propTypes = {
    /**
     * Provide aria-label to the <select> element
     */
    ariaLabel: PropTypes.string,

    /**
     * Provide the contents of your TimePickerSelect
     */
    children: PropTypes.node,

    /**
     * Specify an optional className to be applied to the node containing the label and the select box
     */
    className: PropTypes.string,

    /**
     * Optionally provide the default value of the `<select>`
     */
    defaultValue: PropTypes.any,

    /**
     * Specify whether the control is disabled
     */
    disabled: PropTypes.bool,

    /**
     * iconDescription is deprecated and will be removed in the next major release.
     */
    iconDescription: deprecate(
      PropTypes.string,
      'The `hideLabel` prop for `TimePickerSelect` is no longer needed and has ' +
        'been deprecated. It will be removed in the next major release.'
    ),

    /**
     * Specify a custom `id` for the `<select>`
     */
    id: PropTypes.string.isRequired,

    /**
     * Provide label text to be read by screen readers when interacting with the
     * control
     */
    labelText: PropTypes.node.isRequired,
  };

  static defaultProps = {
    disabled: false,
  };

  render() {
    const {
      ['aria-label']: ariaLabel = 'open list of options',
      children,
      className,
      disabled,
      id,
      iconDescription,
      ...rest
    } = this.props;

    const selectClasses = classNames({
      [`${prefix}--select`]: true,
      [`${prefix}--time-picker__select`]: true,
      [className]: className,
    });

    return (
      <div className={selectClasses}>
        <select
          className={`${prefix}--select-input`}
          disabled={disabled}
          id={id}
          aria-label={ariaLabel}
          {...rest}>
          {children}
        </select>
        <ChevronDown16
          className={`${prefix}--select__arrow`}
          aria-label={ariaLabel ? ariaLabel : iconDescription}
          aria-hidden="true"
        />
      </div>
    );
  }
}
