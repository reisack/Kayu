// mock API calls
require('jest-fetch-mock').enableMocks();

// mock console
globalThis.console = {
  ...console,
  log: () => {},
  debug: () => {},
  info: () => {},
  error: () => {},
};
