import { Config } from '@remotion/cli/config';
import path from 'path';

Config.overrideWebpackConfig((currentConfiguration) => {
  // process.cwd() = leanslide/remotion-slides/
  const dsPath = path.resolve(process.cwd(), '../../storybook-ds/src');

  return {
    ...currentConfiguration,
    resolve: {
      ...currentConfiguration.resolve,
      alias: {
        ...(currentConfiguration.resolve?.alias ?? {}),
        '@ds': dsPath,
      },
    },
  };
});
