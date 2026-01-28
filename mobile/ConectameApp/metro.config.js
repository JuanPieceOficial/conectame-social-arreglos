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
    alias: {
      '@': path.resolve(__dirname, './src'), // Map '@' to the 'src' directory
    },
    // Ensure all packages are resolved from the local node_modules
    nodeModulesPaths: [path.resolve(__dirname, './node_modules')],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
