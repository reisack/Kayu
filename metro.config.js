const path = require('node:path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const isE2E = process.env.KAYU_E2E === 'true';
const barcodeScannerCameraModule =
  '@/services/barcode-scanner/barcode-scanner-camera';
const e2eBarcodeScannerCameraPath = path.resolve(
  __dirname,
  'e2e/barcode-scanner-camera.tsx',
);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  cacheVersion: isE2E ? 'kayu-e2e' : 'kayu-app',
  resolver: {
    resolveRequest: (context, moduleName, platform) => {
      if (isE2E && moduleName === barcodeScannerCameraModule) {
        return {
          type: 'sourceFile',
          filePath: e2eBarcodeScannerCameraPath,
        };
      }

      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
