/*
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
*/

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, select, text } from '@storybook/addon-knobs';
import { withReadme } from 'storybook-readme';
import OverflowMenu from '../OverflowMenu';
import OverflowMenuItem from '../OverflowMenuItem';
import OverflowREADME from './README.md';

const directions = {
  'Bottom of the trigger button (bottom)': 'bottom',
  'Top of the trigger button (top)': 'top',
};

const props = {
  menu: () => ({
    direction: select('Menu direction (direction)', directions, 'bottom'),
    ariaLabel: text('ARIA label (ariaLabel)', 'Menu'),
    iconDescription: text('Icon description (iconDescription)', ''),
    flipped: boolean('Flipped (flipped)', false),
    light: boolean('Light (light)', false),
    selectorPrimaryFocus: text(
      'Primary focus element selector (selectorPrimaryFocus)',
      ''
    ),
    onClick: action('onClick'),
    onFocus: action('onFocus'),
    onKeyDown: action('onKeyDown'),
    onClose: action('onClose'),
    onOpen: action('onOpen'),
  }),
  menuItem: () => ({
    className: 'some-class',
    disabled: boolean('Disabled (disabled)', false),
    requireTitle: boolean(
      'Use hover over text for menu item (requireTitle)',
      false
    ),
    onClick: action('onClick'),
  }),
};

OverflowMenu.displayName = 'OverflowMenu';

storiesOf('OverflowMenu', module)
  .addParameters({
    component: OverflowMenu,
    subcomponents: {
      OverflowMenuItem,
    },
  })
  .addDecorator(withKnobs)
  .add(
    'basic',
    withReadme(OverflowREADME, () => (
      <OverflowMenu {...props.menu()}>
        <OverflowMenuItem {...props.menuItem()} itemText="Option 1" />
        <OverflowMenuItem
          {...props.menuItem()}
          itemText="Option 2 is an example of a really long string and how we recommend handling this"
          requireTitle
        />
        <OverflowMenuItem {...props.menuItem()} itemText="Option 3" />
        <OverflowMenuItem {...props.menuItem()} itemText="Option 4" />
        <OverflowMenuItem
          {...props.menuItem()}
          itemText="Danger option"
          hasDivider
          isDelete
        />
      </OverflowMenu>
    )),
    {
      info: {
        text: `
            Overflow Menu is used when additional options are available to the user and there is a space constraint.
            Create Overflow Menu Item components for each option on the menu.
          `,
      },
    }
  )
  .add(
    'with links',
    withReadme(OverflowREADME, () => (
      <OverflowMenu {...props.menu()}>
        <OverflowMenuItem
          {...{
            ...props.menuItem(),
            href: 'https://www.ibm.com',
          }}
          itemText="Option 1"
        />
        <OverflowMenuItem
          {...{
            ...props.menuItem(),
            href: 'https://www.ibm.com',
          }}
          itemText="Option 2 is an example of a really long string and how we recommend handling this"
          requireTitle
        />
        <OverflowMenuItem
          {...{
            ...props.menuItem(),
            href: 'https://www.ibm.com',
          }}
          itemText="Option 3"
        />
        <OverflowMenuItem
          {...{
            ...props.menuItem(),
            href: 'https://www.ibm.com',
          }}
          itemText="Option 4"
        />
        <OverflowMenuItem
          {...{
            ...props.menuItem(),
            href: 'https://www.ibm.com',
          }}
          itemText="Danger option"
          hasDivider
          isDelete
        />
      </OverflowMenu>
    )),
    {
      info: {
        text: `
            Overflow Menu is used when additional options are available to the user and there is a space constraint.
            Create Overflow Menu Item components for each option on the menu.

            When given \`href\` props, menu items render as <a> tags to facilitate usability.
          `,
      },
    }
  )
  .add(
    'custom trigger',
    withReadme(OverflowREADME, () => (
      <OverflowMenu
        {...{
          ...props.menu(),
          ariaLabel: null,
          style: { width: 'auto' },
          // eslint-disable-next-line react/display-name
          renderIcon: () => <div style={{ padding: '0 1rem' }}>Menu</div>,
        }}>
        <OverflowMenuItem {...props.menuItem()} itemText="Option 1" />
        <OverflowMenuItem
          {...props.menuItem()}
          itemText="Option 2 is an example of a really long string and how we recommend handling this"
          requireTitle
        />
        <OverflowMenuItem {...props.menuItem()} itemText="Option 3" />
        <OverflowMenuItem {...props.menuItem()} itemText="Option 4" />
        <OverflowMenuItem
          {...props.menuItem()}
          itemText="Danger option"
          hasDivider
          isDelete
        />
      </OverflowMenu>
    )),
    {
      info: {
        text: `
            Sometimes you just want to render something other than an icon
          `,
      },
    }
  );
