const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const projectRoot = __dirname;

const config = {
    resolver: {
        extraNodeModules: {
            "@": path.resolve(projectRoot, "src"),
        },
    },
    watchFolders: [
        path.resolve(projectRoot, "src"),
    ],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
