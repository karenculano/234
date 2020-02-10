/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useContext, createContext, useReducer } from 'react';
import cloneDeep from 'lodash.clonedeep';

// minimal column width
// based on the minimal width in sticky header tables
const colMinWidth = 40;

// resizing actions
// currently only exported for testing
export const actionTypes = {
  ADD_COLUMN: 'ADD_COLUMN',
  REMOVE_COLUMN: 'REMOVE_COLUMN',
  START_RESIZE_ACTION: 'START_RESIZE_ACTION',
  END_RESIZE_ACTION: 'END_RESIZE_ACTION',
  UPDATE_COLWIDTH: 'UPDATE_COLWIDTH',
  BATCH_SET_COLWIDTHS: 'BATCH_SET_COLWIDTHS',
  SYNC_TABLE_WIDTH: 'SYNC_TABLE_WIDTH,',
};

// context that holds the store
const ResizeContext = createContext();

// the resizing store's initial values
// currently only exported for testing
export const initialState = {
  allColumnKeys: [], // used for column order
  columnsByKey: {}, // contains columns with width
  resizeActivity: {}, // colKey and pos when resizing is active
  tableWidth: 0,
};

// reducer for the resizing actions
// currently only exported for testing
export const resizeReducer = (state, action) => {
  if (action.type === actionTypes.ADD_COLUMN) {
    const clonedState = cloneDeep(state);
    clonedState.columnsByKey[action.colKey] = {
      ref: action.ref,
      colWidth: action.colWidth,
      initialColWidth: action.colWidth,
    };
    clonedState.allColumnKeys = state.allColumnKeys.concat([action.colKey]);
    return clonedState;
  }

  if (action.type === actionTypes.START_RESIZE_ACTION) {
    const clonedState = cloneDeep(state);
    clonedState.resizeActivity = {
      colKey: action.colKey,
      initialPos: action.initialPos,
      lastUpdatedPos: action.initialPos,
    };
    return clonedState;
  }

  if (action.type === actionTypes.END_RESIZE_ACTION) {
    const clonedState = cloneDeep(state);
    clonedState.resizeActivity = {};
    // initialColWidths will be reset by BATCH_SET_COLWIDTHS
    return clonedState;
  }

  if (action.type === actionTypes.REMOVE_COLUMN) {
    const clonedState = cloneDeep(state);
    delete clonedState.columnsByKey[action.colKey];
    clonedState.allColumnKeys = state.allColumnKeys.filter(
      item => item !== action.colKey
    );
    return clonedState;
  }

  if (action.type === actionTypes.UPDATE_COLWIDTH) {
    const clonedState = cloneDeep(state);

    const widthDiff = action.pos - clonedState.resizeActivity.initialPos;
    const newWidth = incrementColumnFromInitial(
      clonedState,
      widthDiff,
      action.colKey
    );

    const fullWidth = clonedState.tableWidth;
    const maxColWidth =
      fullWidth - (clonedState.allColumnKeys.length - 1) * colMinWidth;

    console.log(`full: ${fullWidth}, new: ${newWidth}, max:${maxColWidth}`);

    // dont do any changes if we have reached minimum width or all other columns are at minimum
    if (newWidth > colMinWidth && newWidth < maxColWidth) {
      clonedState.columnsByKey[action.colKey].colWidth = newWidth;

      // current resize strategy (works best on columns with minmal width - like sticky header tables)
      // first we try to modify the columns to the right
      // going right: when we reach the min width of the columns to the right, ...
      // ... then we start modifying the left columns
      // when we move back to the left: we first increase cols to the left up to their initial width
      // then increase the columns to the right again

      const colIdx = clonedState.allColumnKeys.indexOf(action.colKey);

      const colKeysToTheLeft = clonedState.allColumnKeys.slice(0, colIdx);
      const {
        colWidthSum: curWidthLeft,
        initialColWidthSum: initialWidthLeft,
      } = getAccumulatedWidths(state, colKeysToTheLeft);

      const colKeysToTheRight = clonedState.allColumnKeys.slice(colIdx + 1);
      const {
        colWidthSum: curWidthRight,
        initialColWidthSum: initialWidthRight,
        minColWidthSum: minWidthRight,
      } = getAccumulatedWidths(state, colKeysToTheRight);

      const numCols = clonedState.allColumnKeys.length;
      const decreasingColumnWith =
        action.pos < clonedState.resizeActivity.lastUpdatedPos;

      // modify right columns as long as we do not hit min width for all of them
      // or when left columns are at initial width
      // but not if we are the last column
      if (
        colIdx !== numCols - 1 &&
        (curWidthRight > minWidthRight || initialWidthLeft < curWidthLeft)
      ) {
        console.log('R');
        // only distribute to columns at minimal width when they can grow
        const colKeysToDistribute = decreasingColumnWith
          ? colKeysToTheRight
          : colKeysToTheRight.filter(
              key => clonedState.columnsByKey[key].colWidth > colMinWidth
            );
        distributeOverColumn(
          clonedState,
          -widthDiff,
          colKeysToDistribute,
          true
        );
      } else {
        console.log('L');
        // modify columns to the left
        // what we already distributed to the right cols
        const distributedToTheRight = initialWidthRight - curWidthRight;
        const distributeToTheLeft = widthDiff - distributedToTheRight;

        // only distribute to columns at minimal width when they can grow
        const colKeysToDistribute = decreasingColumnWith
          ? colKeysToTheLeft
          : colKeysToTheLeft.filter(
              key => clonedState.columnsByKey[key].colWidth > colMinWidth
            );
        distributeOverColumn(
          clonedState,
          -distributeToTheLeft,
          colKeysToDistribute,
          true
        );
      }
    }
    // remember this position as last updated pos
    clonedState.resizeActivity.lastUpdatedPos = action.pos;

    return clonedState;
  }

  if (action.type === actionTypes.SYNC_TABLE_WIDTH) {
    const clonedState = cloneDeep(state);

    // compare actual table with with what we have stored
    const curWidth =
      clonedState.allColumnKeys.length &&
      clonedState.allColumnKeys
        .map(key => clonedState.columnsByKey[key].colWidth)
        .reduce((sum, width) => sum + width);

    const diff = action.tableWidth - curWidth;
    distributeOverColumn(clonedState, diff, clonedState.allColumnKeys, false);
    clonedState.tableWidth = action.tableWidth;

    return clonedState;
  }

  if (action.type === actionTypes.BATCH_SET_COLWIDTHS) {
    const clonedState = cloneDeep(state);
    clonedState.tableWidth = action.tableWidth;
    Object.entries(action.colWidths).forEach(entry => {
      const [key, width] = entry;
      clonedState.columnsByKey[key].colWidth = width;
      clonedState.columnsByKey[key].initialColWidth = width;
    });
    return clonedState;
  }

  throw new Error(`Unhandled action type: ${action.type}`);
};

// sum up column width, initial col width and min col width for a list of columns
function getAccumulatedWidths(state, columnIds) {
  return columnIds.length
    ? columnIds
        .map(key => ({
          width: state.columnsByKey[key].colWidth,
          iwidth: state.columnsByKey[key].initialColWidth,
          mwidth: colMinWidth,
        }))
        .reduce(
          (sum, val) => ({
            colWidthSum: sum.colWidthSum + val.width,
            initialColWidthSum: sum.initialColWidthSum + val.iwidth,
            minColWidthSum: sum.minColWidthSum + val.mwidth,
          }),
          {
            colWidthSum: 0,
            initialColWidthSum: 0,
            minColWidthSum: 0,
          }
        )
    : {
        colWidthSum: 0,
        initialColWidthSum: 0,
        minColWidthSum: 0,
      };
}

// increment column over initial with min width in mind
function incrementColumnFromInitial(state, incr, key) {
  const newColWidth = state.columnsByKey[key].initialColWidth + incr;
  return Math.max(colMinWidth, newColWidth);
}

// increment column over last width with min width in mind
function incrementColumn(state, incr, key) {
  const newColWidth = state.columnsByKey[key].colWidth + incr;
  return Math.max(colMinWidth, newColWidth);
}

// distribute an increment of width `diff` (positive or negative)
// over the columns specified in `columnIds`, and respect
// the minimal column width
function distributeOverColumn(state, diff, columnIds, fromInititial) {
  if (diff) {
    const colDiff = diff / columnIds.length; // subpixels
    columnIds.forEach(key => {
      const newWidth = fromInititial
        ? incrementColumnFromInitial(state, colDiff, key)
        : incrementColumn(state, colDiff, key);
      state.columnsByKey[key].colWidth = newWidth;
    });
  }
}

// context provider for resizing actions
// needs to be defined over the whole table including header and cells
export const ResizeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(resizeReducer, initialState);

  return (
    <ResizeContext.Provider value={{ state, dispatch }}>
      {children}
    </ResizeContext.Provider>
  );
};

// currently only exported for testing
export function getColRefs(state) {
  return Object.keys(state.columnsByKey).map(colKey => ({
    key: colKey,
    ref: state.columnsByKey[colKey].ref,
  }));
}

// the custom hook that provides the resizing functionality
// including the width of the column
export const useColumnResizing = colKey => {
  const context = useContext(ResizeContext);
  if (!context) {
    // no resizing context defined
    return {
      colWidth: 0,
      ref: null,
      columnKeyResizeActive: null,
      initColumnResizing: () => {
        /* empty */
      },
      cleanupColumnResizing: () => {
        /* empty */
      },
      startResizeAction: () => {
        /* empty */
      },
      endResizeAction: () => {
        /* empty */
      },
      resizeColumn: () => {
        /* empty */
      },
      syncOnWindowResize: () => {
        /* empty */
      },
    };
  }

  const { state, dispatch } = context;
  const col = state.columnsByKey[colKey];

  const getActualColWidths = () => {
    const colWidths = {};
    getColRefs(state).forEach(({ key, ref }) => {
      const colWidth = ref.current && ref.current.getBoundingClientRect().width;
      colWidths[key] = colWidth;
    });
    return colWidths;
  };

  const getFullWidth = headerRef => {
    const tr = headerRef.current.closest('tr');
    if (tr) {
      const { width } = tr.getBoundingClientRect();
      return width;
    }
    return 0;
  };

  return {
    colWidth: col && col.colWidth,
    ref: col && col.ref,
    columnKeyResizeActive: state.resizeActivity.colKey,

    // add a new column to the store
    initColumnResizing: newRef => {
      const colWidth =
        newRef &&
        newRef.current &&
        newRef.current.getBoundingClientRect().width;
      dispatch({ type: actionTypes.ADD_COLUMN, colKey, ref: newRef, colWidth });
    },

    // removes a column from the store
    cleanupColumnResizing: () => {
      dispatch({ type: actionTypes.REMOVE_COLUMN, colKey });
    },

    // a resizing action has started on this column
    startResizeAction: (initialPos, ref) => {
      // sync column width in store with actual column width
      // because they may not exactly align anymore
      const tableWidth = getFullWidth(ref);
      dispatch({
        type: actionTypes.BATCH_SET_COLWIDTHS,
        colWidths: getActualColWidths(),
        tableWidth,
      });
      dispatch({ type: actionTypes.START_RESIZE_ACTION, colKey, initialPos });
    },

    // a resizing action has finishes on this column
    endResizeAction: () => {
      dispatch({ type: actionTypes.END_RESIZE_ACTION, colKey });
    },

    // change the column width by an increment
    resizeColumn: pos => {
      dispatch({ type: actionTypes.UPDATE_COLWIDTH, colKey, pos });
    },

    // sync stored column widths with resized table width
    syncOnWindowResize: ref => {
      const tableWidth = getFullWidth(ref);
      if (tableWidth) {
        dispatch({
          type: actionTypes.SYNC_TABLE_WIDTH,
          colKey,
          tableWidth,
        });
      }
    },
  };
};
