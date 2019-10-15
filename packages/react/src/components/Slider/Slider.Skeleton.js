/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React from 'react';
import { settings } from 'carbon-components';

const { prefix } = settings;

const SliderSkeleton = ({ hideLabel }) => (
  <div className={`${prefix}--form-item`}>
    {!hideLabel && <span className={`${prefix}--label ${prefix}--skeleton`} />}
    <div className={`${prefix}--slider-container ${prefix}--skeleton`}>
      <span className={`${prefix}--slider__range-label`} />
      <div
        aria-label="loading slider"
        aria-live="assertive"
        className={`${prefix}--slider`}
        role="status"
        tabindex="0" // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
      >
        <div className={`${prefix}--slider__track`} />
        <div className={`${prefix}--slider__filled-track`} />
        <div className={`${prefix}--slider__thumb`} />
      </div>
      <span className={`${prefix}--slider__range-label`} />
    </div>
  </div>
);

SliderSkeleton.propTypes = {
  /**
   * Specify whether the label should be hidden, or not
   */
  hideLabel: PropTypes.bool,
};

export default SliderSkeleton;
