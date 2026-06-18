/// <reference types="detox/globals" />

import { E2E_BARCODE_SCANNER_CAMERA_MOCK } from './barcode-scanner-camera';

const launchApp = async (
  permissions: Detox.DeviceLaunchAppConfig['permissions'],
) => {
  await device.launchApp({
    newInstance: true,
    delete: true,
    permissions,
    launchArgs: {
      detoxURLBlacklistRegex: '.*openfoodfacts\\.org.*',
    },
  });
};

describe('Kayu', () => {
  describe('Home', () => {
    it('should display scan and privacy actions when camera access is granted', async () => {
      await launchApp({ camera: 'YES' });

      await expect(element(by.id('barcode-scanner-button'))).toBeVisible();
      await expect(element(by.id('privacy-link'))).toBeVisible();
    });
  });

  describe('Barcode scanner camera mock', () => {
    beforeEach(async () => {
      await launchApp({ camera: 'YES' });
    });

    it('should navigate from home to the product screen after a mocked scan', async () => {
      await element(by.id('barcode-scanner-button')).tap();

      await waitFor(
        element(
          by.id(`product-screen-${E2E_BARCODE_SCANNER_CAMERA_MOCK.barcode}`),
        ),
      )
        .toBeVisible()
        .withTimeout(10000);
    });
  });
});
