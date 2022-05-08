/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

// mock API calls
require('jest-fetch-mock').enableMocks();

// mock console
global.console = {
  ...console,
  log: () => {},
  debug: () => {},
  info: () => {},
  error: () => {},
};

module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
