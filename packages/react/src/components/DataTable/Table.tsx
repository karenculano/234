/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  useContext,
  PropsWithChildren,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import debounce from 'lodash.debounce';
import { usePrefix } from '../../internal/usePrefix';
import { TableContext } from './TableContext';
import { useWindowEvent } from '../../internal/useEvent';

interface TableProps {
  experimentalAutoAlign?: boolean;

  className?: string;

  /**
   * `false` If true, will apply sorting styles
   */
  isSortable?: boolean;

  /**
   * Specify whether the overflow menu (if it exists) should be shown always, or only on hover
   */
  overflowMenuOnHover?: boolean;

  /**
   *  Change the row height of table. Currently supports `xs`, `sm`, `md`, `lg`, and `xl`.
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * `false` If true, will keep the header sticky (only data rows will scroll)
   */
  stickyHeader?: boolean;

  /**
   * `false` If true, will use a width of 'auto' instead of 100%
   */
  useStaticWidth?: boolean;

  /**
   * `true` to add useZebraStyles striping.
   */
  useZebraStyles?: boolean;
}

export const Table = ({
  className,
  children,
  useZebraStyles,
  size = 'lg',
  isSortable = false,
  useStaticWidth,
  stickyHeader,
  overflowMenuOnHover = true,
  experimentalAutoAlign = false,
  ...other
}: PropsWithChildren<TableProps>) => {
  const { titleId, descriptionId } = useContext(TableContext);
  const prefix = usePrefix();
  const tableRef = useRef<HTMLTableElement>(null);
  const componentClass = cx(`${prefix}--data-table`, className, {
    [`${prefix}--data-table--${size}`]: size,
    [`${prefix}--data-table--sort`]: isSortable,
    [`${prefix}--data-table--zebra`]: useZebraStyles,
    [`${prefix}--data-table--static`]: useStaticWidth,
    [`${prefix}--data-table--sticky-header`]: stickyHeader,
    [`${prefix}--data-table--visible-overflow-menu`]: !overflowMenuOnHover,
  });

  const toggleTableAlignmentClass = useCallback(
    (alignTop = false) => {
      alignTop
        ? tableRef.current?.classList.add(`${prefix}--data-table--top-aligned`)
        : tableRef.current?.classList.remove(
            `${prefix}--data-table--top-aligned`
          );
    },
    [prefix]
  );

  const setTableAlignment = useCallback(() => {
    if (experimentalAutoAlign) {
      const fragment = document.createDocumentFragment();
      const canvas = document.createElement('canvas');
      fragment.appendChild(canvas);
      const context = canvas.getContext('2d');

      if (tableRef.current && context) {
        const isMultiline = Array.from(
          tableRef.current.querySelectorAll('td')
        ).some((td) => {
          if (td.children.length > 0) {
            return;
          }
          const computedStyles = window.getComputedStyle(td);
          context.font = computedStyles.font
            ? computedStyles.font
            : `${computedStyles.fontSize}" "${computedStyles.fontFamily}`;

          const measuredText = context?.measureText(td.textContent ?? '');

          let textWidth = measuredText.width ?? 0;
          // account for letter spacing
          const letterSpacing = computedStyles.letterSpacing?.split('px');
          if (letterSpacing && letterSpacing.length) {
            textWidth +=
              Number(letterSpacing[0]) * (td.textContent?.length ?? 0);
          }
          // account for padding
          const paddingLeft = computedStyles.paddingLeft?.split('px');
          if (paddingLeft && paddingLeft.length) {
            textWidth += Number(paddingLeft[0]);
          }

          const paddingRight = computedStyles.paddingLeft?.split('px');
          if (paddingRight && paddingRight.length) {
            textWidth += Number(paddingRight[0]);
          }
          // if measured textWidth is larger than the cell's width, then the content is being wrapped
          if (textWidth > td.getBoundingClientRect().width) {
            return true;
          }
        });
        toggleTableAlignmentClass(isMultiline);
      }
    } else {
      toggleTableAlignmentClass(false);
    }
  }, [experimentalAutoAlign, toggleTableAlignmentClass]);

  const debouncedSetTableAlignment = debounce(setTableAlignment, 100);

  useWindowEvent('resize', debouncedSetTableAlignment);

  useEffect(() => {
    setTableAlignment();
  }, [setTableAlignment, size]);

  const table = (
    <div className={`${prefix}--data-table-content`}>
      <table
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        {...other}
        className={componentClass}
        ref={tableRef}>
        {children}
      </table>
    </div>
  );
  return stickyHeader ? (
    <section className={`${prefix}--data-table_inner-container`}>
      {table}
    </section>
  ) : (
    table
  );
};

Table.propTypes = {
  /**
   * Pass in the children that will be rendered within the Table
   */
  children: PropTypes.node,
  className: PropTypes.string,

  /**
   * Experimental property. Allows table to align cell contents to the top if there is text wrapping in the content. Might have performance issues, intended for smaller tables
   */
  experimentalAutoAlign: PropTypes.bool,

  /**
   * `false` If true, will apply sorting styles
   */
  isSortable: PropTypes.bool,

  /**
   * Specify whether the overflow menu (if it exists) should be shown always, or only on hover
   */
  overflowMenuOnHover: PropTypes.bool,

  /**
   *  Change the row height of table. Currently supports `xs`, `sm`, `md`, `lg`, and `xl`.
   */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),

  /**
   * `false` If true, will keep the header sticky (only data rows will scroll)
   */
  stickyHeader: PropTypes.bool,

  /**
   * `false` If true, will use a width of 'auto' instead of 100%
   */
  useStaticWidth: PropTypes.bool,

  /**
   * `true` to add useZebraStyles striping.
   */
  useZebraStyles: PropTypes.bool,
};

Table.defaultProps = {
  isSortable: false,
  overflowMenuOnHover: true,
};

export default Table;
