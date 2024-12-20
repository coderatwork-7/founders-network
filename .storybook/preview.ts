import type {Preview} from '@storybook/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.scss';

const preview: Preview = {
  parameters: {
    actions: {argTypesRegex: '^on[A-Z].*'},
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    }
  }
};

export default preview;
