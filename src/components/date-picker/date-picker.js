import Flatpickr from 'flatpickr';
import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch
  from '../../globals/js/mixins/init-component-by-search';

// `this.options` create-component mix-in creates prototype chain
// so that `options` given in constructor argument wins over the one defined in static `options` property
// 'Flatpickr' wants flat structure of object instead

function flattenOptions(options) {
  const o = {};
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const key in options) {
    o[key] = options[key];
  }
  return o;
}

class DatePicker extends mixin(createComponent, initComponentBySearch) {
  /**
   * DatePicker.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @param {HTMLElement} element The element working as an date picker.
   */
  constructor(element, options) {
    super(element, options);
    const type = this.element.getAttribute(this.options.attribType);
    if (type === 'no-calendar') {
      this._addInputLogic(this.element.querySelector(this.options.selectorDatePickerInput));
    } else {
      this.calendar = this._initDatePicker(type);
    }
  }

  _initDatePicker = (type) => {
    const date = (type === 'single')
    ? this.element.querySelector(this.options.selectorDatePickerInput)
    : this.element.querySelector(this.options.selectorDatePickerInputFrom);
    const calendar = new Flatpickr(date, Object.assign(flattenOptions(this.options), {
      allowInput: true,
      mode: type,
      onClose: (selectedDates) => {
        this._updateInputFields(selectedDates, type);
      },
      onChange: () => {
        this._updateClassNames(calendar);
      },
      onMonthChange: () => {
        this._updateClassNames(calendar);
      },
      onYearChange: () => {
        this._updateClassNames(calendar);
      },
      onOpen: () => {
        this._updateClassNames(calendar);
      },
      nextArrow: this._rightArrowHTML(),
      prevArrow: this._leftArrowHTML(),
    }));
    if (type === 'range') {
      this.element.querySelector(this.options.selectorDatePickerInputTo).addEventListener('click', () => {
        this.element.querySelector(this.options.selectorDatePickerInputTo).focus();
        calendar.open();
      });
      this._addInputLogic(this.element.querySelector(this.options.selectorDatePickerInputTo));
    }
    this.element.querySelector(this.options.selectorDatePickerIcon).addEventListener('click', () => {
      calendar.open();
    });
    this._addInputLogic(date);
    return calendar;
  }

  setMinDate = (date) => {
    this.calendar.set('minDate', date);
  }

  setMaxDate = (date) => {
    this.calendar.set('maxDate', date);
  }

  setDisabledDates = (dates) => {
    this.calendar.set('disable', dates);
  }

  setDefaultDates = (dates) => {
    this.calendar.set('defaultDate', dates);
  }

  _rightArrowHTML() {
    return (`
      <svg width="8" height="12" viewBox="0 0 8 12" fill-rule="evenodd">
        <path d="M0 10.6L4.7 6 0 1.4 1.4 0l6.1 6-6.1 6z"></path>
      </svg>`
    );
  }

  _leftArrowHTML() {
    return (`
      <svg width="8" height="12" viewBox="0 0 8 12" fill-rule="evenodd">
        <path d="M7.5 10.6L2.8 6l4.7-4.6L6.1 0 0 6l6.1 6z"></path>
      </svg>`
    );
  }

  _addInputLogic = (input) => {
    const inputField = input;
    inputField.addEventListener('change', () => {
      if (inputField.value.length === 10) {
        this.calendar.setDate(this.calendar.parseDate(new Date(inputField.value)));
      }
    });
  }

  _updateClassNames = (calendar) => {
    const calendarContainer = calendar.calendarContainer;
    calendarContainer.classList.add(this.options.classCalendarContainer);
    calendarContainer.querySelector('.flatpickr-month').classList.add(this.options.classMonth);
    calendarContainer.querySelector('.flatpickr-weekdays').classList.add(this.options.classWeekdays);
    calendarContainer.querySelector('.flatpickr-days').classList.add(this.options.classDays);
    [...calendarContainer.querySelectorAll('.flatpickr-weekday')].forEach((item) => {
      const currentItem = item;
      currentItem.innerHTML = currentItem.innerHTML.replace(/\s+/g, '');
      currentItem.classList.add(this.options.classWeekday);
      if (currentItem.innerHTML === 'Thu' || currentItem.innerHTML === 'Th') {
        currentItem.innerHTML = 'Th';
      } else {
        currentItem.innerHTML = item.innerHTML.charAt(0);
      }
    });
    [...calendarContainer.querySelectorAll('.flatpickr-day')].forEach((item) => {
      item.classList.add(this.options.classDay);
      if (item.classList.contains('today') && calendar.selectedDates.length > 0) {
        item.classList.add('no-border');
      } else if (item.classList.contains('today') && calendar.selectedDates.length === 0) {
        item.classList.remove('no-border');
      }
    });
  }

  _updateInputFields = (selectedDates, type) => {
    if (type === 'range') {
      if (selectedDates.length === 2) {
        this.element.querySelector(this.options.selectorDatePickerInputFrom).value = this._formatDate(selectedDates[0]);
        this.element.querySelector(this.options.selectorDatePickerInputTo).value = this._formatDate(selectedDates[1]);
      } else if (selectedDates.length === 1) {
        this.element.querySelector(this.options.selectorDatePickerInputFrom).value = this._formatDate(selectedDates[0]);
      }
    } else if (selectedDates.length === 1) {
      this.element.querySelector(this.options.selectorDatePickerInput).value = this._formatDate(selectedDates[0]);
    }
  }

  _formatDate = date => this.calendar.formatDate(date, this.calendar.config.dateFormat);

  release() {
    if (this.calendar) {
      try {
        this.calendar.destroy();
      } catch (err) {} // eslint-disable-line no-empty
      this.calendar = null;
    }
    return super.release();
  }

  /**
   * The component options.
   * If `options` is specified in the constructor,
   * {@linkcode DatePicker.create .create()}, or {@linkcode DatePicker.init .init()},
   * properties in this object are overriden for the instance being create and how {@linkcode DatePicker.init .init()} works.
   * @property {string} selectorInit The CSS selector to find date picker UIs.
   */
  static options = {
    selectorInit: '[data-date-picker]',
    selectorDatePickerInput: '[data-date-picker-input]',
    selectorDatePickerInputFrom: '[data-date-picker-input-from]',
    selectorDatePickerInputTo: '[data-date-picker-input-to]',
    selectorDatePickerIcon: '[data-date-picker-icon]',
    classCalendarContainer: 'bx--date-picker__calendar',
    classMonth: 'bx--date-picker__month',
    classWeekdays: 'bx--date-picker__weekdays',
    classDays: 'bx--date-picker__days',
    classWeekday: 'bx--date-picker__weekday',
    classDay: 'bx--date-picker__day',
    attribType: 'data-date-picker-type',
    dateFormat: 'm / d / Y',
  };

  /**
   * The map associating DOM element and date picker UI instance.
   * @type {WeakMap}
   */
  static components = new WeakMap();
}

export default DatePicker;
