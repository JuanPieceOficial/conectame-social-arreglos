const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path'); // Import path module
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => {
          if (name === '@') {
            return path.resolve(__dirname, 'src');
          }
          return path.join(process.cwd(), `node_modules/${name}`);
        },
      }
    ),
  },
};

module.exports = wrapWithReanimatedMetroConfig(mergeConfig(getDefaultConfig(__dirname), config));
