/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { settings } from 'carbon-components';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useFeatureFlag } from '../FeatureFlags';

const { prefix } = settings;

const GridContext = React.createContext(false);

function Grid({
  as: BaseComponent = 'div',
  condensed = false,
  narrow = false,
  fullWidth = false,
  subgrid,
  columns = 16,
  className: containerClassName,
  children,
  ...rest
}) {
  const hasCSSGrid = useFeatureFlag('enable-css-grid');
  const hasGridParent = useContext(GridContext);
  const isSubgrid = subgrid || hasGridParent;

  const cssGridClassNames = {
    [`${prefix}--css-grid`]: !isSubgrid,
    [`${prefix}--css-grid--${columns}`]: !isSubgrid && columns !== 16,
    [`${prefix}--css-grid--condensed`]: condensed,
    [`${prefix}--css-grid--narrow`]: narrow,
    [`${prefix}--subgrid`]: isSubgrid,
    [`${prefix}--col-span-${columns}`]: isSubgrid,
  };

  const flexGridClassNames = {
    [`${prefix}--grid`]: true,
    [`${prefix}--grid--condensed`]: condensed,
    [`${prefix}--grid--narrow`]: narrow,
    [`${prefix}--grid--full-width`]: fullWidth,
  };

  const className = cx(
    containerClassName,
    hasCSSGrid ? cssGridClassNames : flexGridClassNames
  );

  return (
    <GridContext.Provider value={{ hasGridParent: true }}>
      <BaseComponent className={className} {...rest}>
        {children}
      </BaseComponent>
    </GridContext.Provider>
  );
}

Grid.propTypes = {
  /**
   * Provide a custom element to render instead of the default <div>
   */
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),

  /**
   * Pass in content that will be rendered within the `Grid`
   */
  children: PropTypes.node,

  /**
   * Specify a custom className to be applied to the `Grid`
   */
  className: PropTypes.string,

  /**
   * Specify how many columns wide the Grid should span
   */
  columns: PropTypes.number,

  /**
   * Collapse the gutter to 1px. Useful for fluid layouts.
   * Rows have 1px of margin between them to match gutter.
   */
  condensed: PropTypes.bool,

  /**
   * Remove the default max width that the grid has set
   */
  fullWidth: PropTypes.bool,

  /**
   * Container hangs 16px into the gutter. Useful for
   * typographic alignment with and without containers.
   */
  narrow: PropTypes.bool,

  /**
   * Specify this grid as a subgrid. This is automatically
   * applied when a <Grid> is nested inside of a parent <Grid>
   */
  subgrid: PropTypes.bool,
};

export default Grid;
