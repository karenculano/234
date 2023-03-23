/**
 * Copyright IBM Corp. 2021
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Toggle from './Toggle';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const prefix = 'cds';

describe('Toggle', () => {
  const props = {
    id: 'toggle-id',
    labelA: 'labelA-unchecked',
    labelB: 'labelB-checked',
    labelText: 'Toggle label',
    toggled: false,
    onToggle: () => {},
  };
  let wrapper;

  beforeEach(() => {
    wrapper = render(<Toggle {...props} />);
  });

  describe('renders as expected', () => {
    it('button and label ids should match', () => {
      const button = wrapper.getByRole('switch');
      const label = wrapper.container.querySelector('label');
      expect(button.id).toBe(label.htmlFor);
    });

    it('renders labelA when unchecked', () => {
      wrapper.rerender(<Toggle {...props} toggled={false} />);
      expect(wrapper.queryByText(props.labelA)).toBeTruthy();
      expect(wrapper.queryByText(props.labelB)).toBeNull();
    });

    it('renders labelB when checked', () => {
      wrapper.rerender(<Toggle {...props} toggled={true} />);
      expect(wrapper.queryByText(props.labelA)).toBeNull();
      expect(wrapper.queryByText(props.labelB)).toBeTruthy();
    });

    it('supports additional css class names', () => {
      const className = 'some-additional-class';
      wrapper.rerender(<Toggle {...props} className={className} />);

      expect(
        wrapper.container
          .querySelector(`.${prefix}--toggle`)
          .classList.contains(className)
      ).toBe(true);
    });

    it('supports sm size', () => {
      expect(
        wrapper.container
          .querySelector(`.${prefix}--toggle__appearance`)
          .classList.contains(`${prefix}--toggle__appearance--sm`)
      ).toBe(false);
      expect(
        wrapper.container.querySelector(`.${prefix}--toggle__check`)
      ).toBeNull();

      wrapper.rerender(<Toggle {...props} size="sm" />);

      expect(
        wrapper.container
          .querySelector(`.${prefix}--toggle__appearance`)
          .classList.contains(`${prefix}--toggle__appearance--sm`)
      ).toBe(true);
      expect(
        wrapper.container.querySelector(`.${prefix}--toggle__check`)
      ).toBeTruthy();
    });

    it('supports to use top label as side label', () => {
      wrapper.rerender(<Toggle {...props} hideLabel />);

      expect(
        wrapper.container
          .querySelector(`.${prefix}--toggle__label-text`)
          .classList.contains(`${prefix}--visually-hidden`)
      ).toBe(true);
      expect(
        wrapper.container.querySelector(`.${prefix}--toggle__text`).textContent
      ).toBe(props.labelText);
    });

    it("doesn't render sideLabel if props.hideLabel and no props.labelText is provided", () => {
      const externalElementId = 'external-element-id';
      wrapper.rerender(
        <Toggle
          {...props}
          hideLabel
          labelText={null}
          aria-labelledby={externalElementId}
        />
      );

      expect(
        wrapper.container.querySelector(`.${prefix}--toggle__text`)
      ).toBeNull();

      expect(wrapper.getByRole('switch').getAttribute('aria-labelledby')).toBe(
        externalElementId
      );

      expect(
        wrapper.container.querySelector(`.${prefix}--toggle__label`).tagName
      ).toBe('DIV');
    });
  });

  describe('behaves as expected', () => {
    it('supports to be disabled', () => {
      expect(wrapper.getByRole('switch').disabled).toBe(false);
      wrapper.rerender(<Toggle {...props} disabled />);
      expect(wrapper.getByRole('switch').disabled).toBe(true);
    });

    it('can be controlled with props.toggled', () => {
      wrapper.rerender(<Toggle {...props} toggled={false} />);
      expect(wrapper.getByRole('switch').getAttribute('aria-checked')).toBe(
        'false'
      );
      wrapper.rerender(<Toggle {...props} toggled={true} />);
      expect(wrapper.getByRole('switch').getAttribute('aria-checked')).toBe(
        'true'
      );
    });

    it('does not change value when readonly', async () => {
      const onClick = jest.fn();
      const onToggle = jest.fn();
      wrapper.rerender(
        <Toggle {...props} onClick={onClick} onToggle={onToggle} readOnly />
      );

      expect(onClick).not.toHaveBeenCalled();
      await userEvent.click(wrapper.getByRole('switch'));
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onToggle).not.toHaveBeenCalled();
    });
  });

  describe('emits events as expected', () => {
    it('passes along props.onClick to button', async () => {
      const onClick = jest.fn();
      wrapper.rerender(<Toggle {...props} onClick={onClick} />);

      expect(onClick).not.toHaveBeenCalled();
      await userEvent.click(wrapper.getByRole('switch'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('emits props.onToggle when toggled and passes current state', async () => {
      const onToggle = jest.fn();

      wrapper.rerender(
        <Toggle {...props} onToggle={onToggle} toggled={false} />
      );
      expect(onToggle).not.toHaveBeenCalled();
      await userEvent.click(wrapper.getByRole('switch'));
      expect(onToggle).toHaveBeenCalledTimes(1);
      expect(onToggle.mock.calls[0][0]).toBe(true);

      wrapper.rerender(
        <Toggle {...props} onToggle={onToggle} toggled={true} />
      );
      await userEvent.click(wrapper.getByRole('switch'));
      expect(onToggle).toHaveBeenCalledTimes(2);
      expect(onToggle.mock.calls[1][0]).toBe(false);
    });
  });
});
