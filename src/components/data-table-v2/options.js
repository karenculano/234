export default settings => {
  const { prefix } = settings;
  return {
    selectorInit: '[data-table-v2]',
    selectorToolbar: `.${prefix}--table--toolbar`,
    selectorActions: `.${prefix}--batch-actions`,
    selectorCount: '[data-items-selected]',
    selectorActionCancel: `.${prefix}--batch-summary__cancel`,
    selectorCheckbox: `.${prefix}--checkbox`,
    selectorExpandCells: `.${prefix}--table-expand-v2`,
    selectorExpandableRows: `.${prefix}--expandable-row-v2`,
    selectorParentRows: `.${prefix}--parent-row-v2`,
    selectorChildRow: '[data-child-row]',
    selectorTableBody: 'tbody',
    selectorTableSort: `.${prefix}--table-sort-v2`,
    classExpandableRow: `${prefix}--expandable-row-v2`,
    classExpandableRowHidden: `${prefix}--expandable-row--hidden-v2`,
    classExpandableRowHover: `${prefix}--expandable-row--hover-v2`,
    classTableSortAscending: `${prefix}--table-sort-v2--ascending`,
    classTableSortActive: `${prefix}--table-sort-v2--active`,
    classActionBarActive: `${prefix}--batch-actions--active`,
    classTableSelected: `${prefix}--data-table-v2--selected`,
    eventBeforeExpand: 'data-table-v2-beforetoggleexpand',
    eventAfterExpand: 'data-table-v2-aftertoggleexpand',
    eventBeforeSort: 'data-table-v2-beforetogglesort',
    eventAfterSort: 'data-table-v2-aftertogglesort',
    eventTrigger: '[data-event]',
    eventParentContainer: '[data-parent-row]',
  };
};
