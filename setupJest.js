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
