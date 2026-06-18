const isE2E = process.env.KAYU_E2E === 'true';

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          ...(isE2E
            ? {
                '@/services/barcode-scanner/barcode-scanner-camera':
                  './e2e/barcode-scanner-camera',
              }
            : {}),
          '@': './src',
          '#': './__tests__',
          assets: './assets',
        },
      },
    ],
  ],
};
