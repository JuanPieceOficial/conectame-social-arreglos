const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path'); // Import path module

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

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
