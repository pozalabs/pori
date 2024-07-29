import { addons } from '@storybook/manager-api';

import { create } from '@storybook/theming/create';

const theme = create({
  base: 'light',
  brandTitle: 'Pori',
  brandUrl: 'https://pozalabs.com',
  brandImage: 'https://poco.pozalabs.com/blog/pozalabs-logo.svg',
  brandTarget: '_self',
  colorSecondary: '#0873ff',
  appBg: '#E5F1FF',
  barBg: '#EFF6FF',
});

addons.setConfig({
  theme,
});
