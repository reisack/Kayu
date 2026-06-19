import { by, device, element, expect, waitFor } from 'detox';
import { E2E_BARCODE_SCANNER_CAMERA_MOCK } from './barcode-scanner-camera';

describe('Kayu', () => {
  const launchApp = async (
    permissions: Detox.DeviceLaunchAppConfig['permissions'],
  ) => {
    await device.launchApp({
      newInstance: true,
      delete: false,
      resetAppState: true,
      permissions,
      launchArgs: {
        detoxURLBlacklistRegex: String.raw`.*openfoodfacts\.org.*`,
      },
    });
  };

  const productScoreTestIDs = [
    'product-score-fat',
    'product-score-salt',
    'product-score-sugar',
    'product-score-novaGroup',
    'product-score-eco',
    'product-score-additives',
  ];

  const waitForProductScreen = async (eanCode: string) => {
    await waitFor(element(by.id(`product-screen-${eanCode}`)))
      .toBeVisible()
      .withTimeout(30000);
  };

  const waitForVisibleInProductScroll = async (
    testID: string,
    timeout = 30000,
  ) => {
    const startTime = Date.now();
    let lastError: unknown = new Error(`Could not find ${testID}`);

    while (Date.now() - startTime < timeout) {
      try {
        await waitFor(element(by.id(testID)))
          .toBeVisible()
          .withTimeout(2000);
        return;
      } catch (error) {
        lastError = error;
      }

      try {
        await element(by.id('product-screen-scroll-view')).scroll(150, 'down');
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  };

  describe('Home', () => {
    it('should display scan and privacy actions when camera access is granted', async () => {
      await launchApp({ camera: 'YES' });

      await expect(element(by.id('barcode-scanner-button'))).toBeVisible();
      await expect(element(by.id('privacy-link'))).toBeVisible();
    });
  });

  describe('Barcode scanner camera mock', () => {
    it('should navigate from home to the product screen after a mocked scan', async () => {
      await launchApp({ camera: 'YES' });

      await waitFor(element(by.id('barcode-scanner-button')))
        .toBeVisible()
        .withTimeout(30000);
      await element(by.id('barcode-scanner-button')).tap();

      await expect(
        element(
          by.id(`product-screen-${E2E_BARCODE_SCANNER_CAMERA_MOCK.barcode}`),
        ),
      ).toBeVisible();
    });
  });

  describe('Product details', () => {
    beforeEach(async () => {
      await launchApp({ camera: 'YES' });

      await waitFor(element(by.id('barcode-scanner-button')))
        .toBeVisible()
        .withTimeout(30000);
      await element(by.id('barcode-scanner-button')).tap();

      await waitForProductScreen(E2E_BARCODE_SCANNER_CAMERA_MOCK.barcode);
    });

    it('should display each product score for a scanned product', async () => {
      for (const productScoreTestID of productScoreTestIDs) {
        await waitForVisibleInProductScroll(productScoreTestID);
      }
    });

    it('should open the first related product suggestion', async () => {
      await waitForVisibleInProductScroll('related-product-button-0');
      await element(by.id('related-product-button-0')).tap();

      await waitFor(element(by.id('related-product-screen')))
        .toBeVisible()
        .withTimeout(30000);
    });
  });
});
