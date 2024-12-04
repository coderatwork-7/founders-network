import type {StorybookConfig} from '@storybook/nextjs';
import path from 'path';
import {Configuration} from 'webpack';

const config: StorybookConfig = {
  stories: [
    '../ds/**/*.mdx',
    '../ds/**/*.stories.@(js|jsx|ts|tsx)',
    '../components/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions'
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {}
  },
  webpackFinal: async (config: Configuration) => {
    (config.resolve?.alias || {})['@'] = path.resolve(__dirname, '../'); // Update the path according to your project structure
    return config;
  },
  staticDirs: ['../public']
};
export default config;
