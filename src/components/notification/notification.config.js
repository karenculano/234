'use strict';

const featureFlags = require('../../globals/js/feature-flags');
const { prefix } = require('../../globals/js/settings');

const items = [
  {
    type: 'info',
    title: 'Notification title',
    subtitle: 'Subtitle text goes here.',
    timestamp: 'Time stamp [00:00:00]',
  },
  {
    type: 'error',
    title: 'Notification title',
    subtitle: 'Subtitle text goes here.',
    timestamp: 'Time stamp [00:00:00]',
  },
  {
    type: 'success',
    title: 'Notification title',
    subtitle:
      'Our goal is to become better at our craft and raise our collective knowledge by sharing experiences, best practices, what we have recently learned or what we are working on.',
    timestamp: 'Time stamp [00:00:00]',
  },
  {
    type: 'warning',
    title: 'Notification title',
    subtitle: 'Subtitle text goes here.',
    timestamp: 'Time stamp [00:00:00]',
  },
];

module.exports = {
  context: {
    featureFlags,
    prefix,
    checkmarkFilledIcon: () => (featureFlags.componentsX ? 'carbon-icon-checkmark-filled' : 'carbon-icon-checkmark-solid'),
    informationFilledIcon: () => (featureFlags.componentsX ? 'carbon-icon-information-filled' : 'carbon-icon-info-solid'),
    warningFilledIcon: () => (featureFlags.componentsX ? 'carbon-icon-warning-alt-filled' : 'carbon-icon-warning-solid'),
    errorFilledIcon: () => (featureFlags.componentsX ? 'carbon-icon-error-filled' : 'carbon-icon-error-solid'),
  },
  variants: [
    {
      name: 'default',
      label: 'Inline Notification',
      context: {
        variant: 'inline',
        items,
        componentsX: featureFlags.componentsX,
      },
    },
    {
      name: 'toast',
      label: 'Toast Notification',
      notes: `
        Toast notifications are typically passive, meaning they won't affect the user's workflow if not addressed.
        Toast Notifications use 'kind' props to specify the kind of notification that should render (error, info, success, warning).
      `,
      context: {
        variant: 'toast',
        items,
        componentsX: featureFlags.componentsX,
      },
    },
  ],
};
