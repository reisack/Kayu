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

  const productScores = [
    {
      testID: 'fat',
      preciseScoreText: '11g de gras pour 100g de produit',
    },
    {
      testID: 'salt',
      preciseScoreText: '0.13g de sel pour 100g de produit',
    },
    {
      testID: 'sugar',
      preciseScoreText: '24g de sucre pour 100g de produit',
    },
    {
      testID: 'novaGroup',
      preciseScoreText: 'Score NOVA : 4 (Transformation des aliments)',
    },
    {
      testID: 'eco',
      preciseScoreText: 'Eco score : 79 (Empreinte carbone)',
    },
    {
      testID: 'additives',
      preciseScoreText: '6 additifs',
    },
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

    it('should display each scanned product score and show its precise details from the info icon', async () => {
      await waitFor(element(by.id('product-screen-scroll-view')))
        .toBeVisible()
        .withTimeout(30000);
      await element(by.id('product-screen-scroll-view')).scroll(250, 'down');

      for (const productScore of productScores) {
        await element(
          by.id(`pressable-info-icon-${productScore.testID}`),
        ).tap();
        await expect(
          element(by.text(productScore.preciseScoreText)),
        ).toBeVisible();
        await element(by.text('OK')).tap();
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
