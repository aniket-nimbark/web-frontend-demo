const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

module.exports = {
    resolver: {
        extraNodeModules: {
            'react-native': require.resolve('react-native'),
            'react-native-web': require.resolve('react-native-web'),
        },
    },
};
