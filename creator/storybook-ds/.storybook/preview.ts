import type { Preview } from '@storybook/react-vite';
import '../src/tokens/global.css';
import '../src/tokens/memphis-fonts.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1A1E26' },
        { name: 'slide', value: '#2B303B' },
      ],
    },
    viewport: {
      viewports: {
        slide: {
          name: 'Slide 16:9',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
        slideHalf: {
          name: 'Slide Half',
          styles: {
            width: '960px',
            height: '540px',
          },
        },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
