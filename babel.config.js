module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@': './src',
          '#': './__tests__',
          assets: './assets',
        },
      },
    ],
  ],
};
