/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, select, text } from '@storybook/addon-knobs';
import { iconAddSolid, iconSearch } from 'carbon-icons';
import {
  Add16,
  AddFilled16,
  Search16,
  PlayOutlineFilled32,
  PlayOutlineFilled16,
} from '@carbon/icons-react';
import Button from '../Button';
import ButtonSkeleton from '../Button/Button.Skeleton';
import ButtonSet from '../ButtonSet';
import mdx from './Button.mdx';

const icons = {
  None: 'None',
  'Add (Add16 from `@carbon/icons-react`)': 'Add16',
  'Add (Filled) (AddFilled16 from `@carbon/icons-react`)': 'AddFilled16',
  'Search (Search16 from `@carbon/icons-react`)': 'Search16',
  'PlayOutlineFilled16 (PlayOutlineFilled16 from `@carbon/icons-react`)':
    'PlayOutlineFilled16',
  'PlayOutlineFilled32 (PlayOutlineFilled32 from `@carbon/icons-react`)':
    'PlayOutlineFilled32',
};

const iconsForControls = {
  Add16,
  AddFilled16,
  Search16,
  PlayOutlineFilled16,
  PlayOutlineFilled32,
};

const iconMap = {
  iconAddSolid,
  iconSearch,
  Add16,
  AddFilled16,
  Search16,
  PlayOutlineFilled16,
  PlayOutlineFilled32,
};

const kinds = {
  'Primary button (primary)': 'primary',
  'Secondary button (secondary)': 'secondary',
  'Tertiary button (tertiary)': 'tertiary',
  'Danger button (danger)': 'danger',
  'Danger tertiary button (danger--tertiary)': 'danger--tertiary',
  'Danger ghost button (danger--ghost)': 'danger--ghost',
  'Ghost button (ghost)': 'ghost',
};

// V11: New size table
// const sizes = {
//   'Small  (sm)': 'sm',
//   'Medium (md)': 'md',
//   'Large  (lg)  - default': null,
//   'Extra Large (xl)': 'xl',
//   'Extra Extra Large (2xl)': '2xl',
// };

const sizes = {
  'Small  (sm)': 'sm',
  'Medium (md)': 'md',
  Default: null,
  'Large (lg)': 'lg',
  'Extra Large (xl)': 'xl',
};

const props = {
  regular: () => {
    const iconToUse = iconMap[select('Icon (icon)', icons, 'none')];
    return {
      className: 'some-class',
      isExpressive: boolean('Expressive', false),
      kind: select('Button kind (kind)', kinds, 'primary'),
      disabled: boolean('Disabled (disabled)', false),
      size: select('Button size (size)', sizes, 'default'),
      renderIcon: !iconToUse || iconToUse.svgData ? undefined : iconToUse,
      iconDescription: text(
        'Icon description (iconDescription)',
        'Button icon'
      ),
      onClick: action('onClick'),
      onFocus: action('onFocus'),
    };
  },
  iconOnly: () => {
    let iconToUse;

    if (iconMap[select('Icon (icon)', icons, 'Add16')] == undefined) {
      iconToUse = Add16;
    } else {
      iconToUse = iconMap[select('Icon (icon)', icons, 'Add16')];
    }
    return {
      className: 'some-class',
      isExpressive: boolean('Expressive', false),
      kind: select('Button kind (kind)', kinds, 'primary'),
      disabled: boolean('Disabled (disabled)', false),
      isSelected: boolean('Selected (isSelected)', false),
      size: select('Button size (size)', sizes, 'default'),
      renderIcon: !iconToUse || iconToUse.svgData ? undefined : iconToUse,
      iconDescription: text(
        'Icon description (iconDescription)',
        'Button icon'
      ),
      tooltipPosition: select(
        'Tooltip position (tooltipPosition)',
        ['top', 'right', 'bottom', 'left'],
        'bottom'
      ),
      tooltipAlignment: select(
        'Tooltip alignment (tooltipAlignment)',
        ['start', 'center', 'end'],
        'center'
      ),
      onClick: action('onClick'),
      onFocus: action('onFocus'),
    };
  },
  set: () => {
    const iconToUse = iconMap[select('Icon (icon)', icons, 'none')];
    return {
      className: 'some-class',
      isExpressive: boolean('Expressive', false),
      disabled: boolean('Disabled (disabled)', false),
      size: select('Button size (size)', sizes, 'default'),
      renderIcon: !iconToUse || iconToUse.svgData ? undefined : iconToUse,
      iconDescription: text(
        'Icon description (iconDescription)',
        'Button icon'
      ),
      stacked: boolean('Stack buttons vertically (stacked)', false),
      onClick: action('onClick'),
      onFocus: action('onFocus'),
    };
  },
};

export default {
  title: 'Components/Button',
  decorators: [withKnobs],
  parameters: {
    component: Button,
    subcomponents: {
      ButtonSet,
      ButtonSkeleton,
    },
    docs: {
      page: mdx,
    },
  },
};

export const _Default = () => {
  return <Button>Button</Button>;
};

_Default.story = {
  name: 'Button',
};

export const SetOfIconButtonsOnTimer = () => {
  const [timer, setTimer] = useState(0);
  const simulateLoading = () => {
    setTimer(true);
    setTimeout(() => {
      setTimer(false);
    }, 3000);
  };

  const [timer2, setTimer2] = useState(0);
  const simulateLoading2 = () => {
    setTimer2(true);
    setTimeout(() => {
      setTimer2(false);
    }, 3000);
  };

  const [timer3, setTimer3] = useState(0);
  const simulateLoading3 = () => {
    setTimer3(true);
    setTimeout(() => {
      setTimer3(false);
    }, 3000);
  };
  return (
    <>
      <div className="App" style={{ padding: '1rem' }}>
        <Button
          hasIconOnly
          renderIcon={Add16}
          tooltipAlignment="center"
          tooltipPosition="bottom"
          iconDescription="Button description here"
          onClick={simulateLoading}
          disabled={timer}
        />
      </div>
      <div className="App" style={{ padding: '1rem' }}>
        <Button
          hasIconOnly
          renderIcon={Add16}
          tooltipAlignment="center"
          tooltipPosition="bottom"
          iconDescription="Button description here"
          onClick={simulateLoading2}
          disabled={timer2}
        />
      </div>
      <div className="App" style={{ padding: '1rem' }}>
        <Button
          hasIconOnly
          renderIcon={Add16}
          tooltipAlignment="center"
          tooltipPosition="bottom"
          iconDescription="Button description here"
          onClick={simulateLoading3}
          disabled={timer3}
        />
      </div>
    </>
  );
};

export const Secondary = () => {
  return <Button kind="secondary">Button</Button>;
};

export const Tertiary = () => {
  return <Button kind="tertiary">Button</Button>;
};

export const Danger = () => {
  return (
    <>
      <Button kind="danger">Button</Button>
      &nbsp;
      <Button kind="danger--tertiary">Tertiary Danger Button</Button>
      &nbsp;
      <Button kind="danger--ghost">Ghost Danger Button</Button>
    </>
  );
};

export const Ghost = () => {
  return <Button kind="ghost">Button</Button>;
};

export const Playground = () => {
  const regularProps = props.regular();
  const iconOnly = props.iconOnly();
  const { stacked, ...buttonProps } = props.set();
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
        <Button {...regularProps}>Buttons</Button>
        &nbsp;
        {!regularProps.kind.includes('danger') && (
          <>
            <Button hasIconOnly {...iconOnly}></Button>
            &nbsp;
            <Button hasIconOnly {...iconOnly} kind="ghost"></Button>
          </>
        )}
      </div>
      <div
        style={{
          marginTop: '1rem',
        }}>
        <ButtonSet stacked={stacked}>
          <Button kind="secondary" {...buttonProps}>
            Secondary button
          </Button>
          <Button kind="primary" {...buttonProps}>
            Primary button
          </Button>
        </ButtonSet>
      </div>
    </>
  );
};

export const Playground2 = (args) => {
  const regularProps = props.regular();
  // const iconOnly = props.iconOnly();
  const { stacked } = props.set();
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
        <Button {...args}>Buttons</Button>
        &nbsp;
        {!regularProps.kind.includes('danger') && (
          <>
            <Button hasIconOnly {...args}></Button>
            &nbsp;
            <Button hasIconOnly {...args} kind="ghost"></Button>
          </>
        )}
      </div>
      <div
        style={{
          marginTop: '1rem',
        }}>
        <ButtonSet stacked={stacked}>
          <Button {...args} kind="secondary">
            Secondary button
          </Button>
          <Button {...args} kind="primary">
            Primary button
          </Button>
        </ButtonSet>
      </div>
    </>
  );
};

Playground2.args = {
  className: 'some-class',
  kind: 'primary',
  icon: 'Add16',
};

Playground2.argTypes = {
  kind: {
    options: [
      'primary',
      'secondary',
      'tertiary',
      'ghost',
      'danger',
      'danger--tertiary',
      'danger--ghost',
    ],
    control: { type: 'select' },
  },
  as: {
    table: {
      disable: true,
    },
  },
  icon: {
    options: Object.keys(iconsForControls), // An array of serializable values
    mapping: iconsForControls, // Maps serializable option values to complex arg values
    control: {
      type: 'select', // Type 'select' is automatically inferred when 'options' is defined
      labels: {
        // 'labels' maps option values to string labels
        Add16: 'Add16',
        AddFilled16: 'AddFilled16',
        Search16: 'Search16',
        PlayOutlineFilled16: 'PlayOutlineFilled16',
        PlayOutlineFilled32: 'PlayOutlineFilled32',
      },
    },
  },
};

export const IconButton = () => (
  <Button
    renderIcon={Add16}
    iconDescription="Icon Description"
    hasIconOnly
    onClick={action('onClick')}
  />
);

IconButton.story = {
  name: 'Icon Button',
};

export const SetOfButtons = () => {
  return (
    <ButtonSet>
      <Button kind="secondary">Secondary button</Button>
      <Button kind="primary">Primary button</Button>
    </ButtonSet>
  );
};

export const ExpressiveButtons = () => {
  return (
    <>
      <div
        style={{
          margin: '1rem',
        }}>
        <Button isExpressive size="default">
          Button
        </Button>
      </div>
      <div
        style={{
          margin: '1rem',
        }}>
        <Button isExpressive size="lg">
          Button
        </Button>
      </div>
      <div
        style={{
          margin: '1rem',
        }}>
        <Button isExpressive size="xl">
          Button
        </Button>
      </div>
      <div
        style={{
          margin: '1rem',
        }}>
        <Button isExpressive size="default" renderIcon={Add16}>
          Button
        </Button>
      </div>
      <div
        style={{
          margin: '1rem',
        }}>
        <Button
          isExpressive
          renderIcon={Add16}
          hasIconOnly
          iconDescription="Icon description"
        />
      </div>
      <div
        style={{
          marginTop: '1rem',
        }}>
        <ButtonSet>
          <Button kind="secondary" isExpressive>
            Secondary button
          </Button>
          <Button kind="primary" isExpressive>
            Primary button
          </Button>
        </ButtonSet>
      </div>
    </>
  );
};

export const Skeleton = () => (
  <div>
    <ButtonSkeleton size="xl" />
    &nbsp;
    <ButtonSkeleton size="lg" />
    &nbsp;
    <ButtonSkeleton />
    &nbsp;
    <ButtonSkeleton size="md" />
    &nbsp;
    <ButtonSkeleton small />
  </div>
);
