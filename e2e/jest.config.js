/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  rootDir: '..',
  preset: '@react-native/jest-preset',
  testMatch: ['<rootDir>/e2e/**/*.test.ts'],
  testTimeout: 120000,
  maxWorkers: 1,
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: ['detox/runners/jest/reporter'],
  testEnvironment: 'detox/runners/jest/testEnvironment',
  setupFiles: ['<rootDir>/setupJest.js'],
  verbose: true,
};
