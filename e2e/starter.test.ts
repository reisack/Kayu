/// <reference types="detox/globals" />

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should barcode-scanner-button button', async () => {
    await expect(element(by.id('barcode-scanner-button'))).toBeVisible();
  });
});
