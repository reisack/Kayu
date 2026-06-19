import { mockRandom, resetMockRandom } from 'jest-mock-random';
import fetchMock from 'jest-fetch-mock';
import RelatedProductsService from '@/services/related-products-service';

import relatedProductsScoresMock from '#/services/mocks/related-products-scores-mock.json';
import relatedProductsSelectedMock from '#/services/mocks/related-products-selected-mock.json';
import relatedProductsScoresEmptyMock from '#/services/mocks/related-products-scores-empty-mock.json';

describe('Related products service', () => {
  let relatedProductsService: RelatedProductsService;

  const getRelatedProductsSearchMock = () => ({
    ...relatedProductsScoresMock,
    products: relatedProductsScoresMock.products.map(product => ({
      ...product,
      ...relatedProductsSelectedMock.products.find(
        selectedProduct => selectedProduct.code === product.code,
      ),
    })),
  });

  beforeEach(() => {
    fetchMock.resetMocks();
    relatedProductsService = new RelatedProductsService(0);
  });

  afterEach(() => {
    resetMockRandom();
  });

  it('should have list when product total score is not the highest', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(getRelatedProductsSearchMock()));

    // Math.Random() will always returns 0.1
    mockRandom([0.1]);

    const results = await relatedProductsService.getRelatedproducts(
      'vanilla-ice-cream-tubs',
      30,
    );

    expect(results[0].eanCode).toEqual('3256221116045');
    expect(results[1].eanCode).toEqual('8714100635698');
    expect(results[2].eanCode).toEqual('40875125');
    expect(results[3].eanCode).toEqual('7613034528971');
    expect(results[4].eanCode).toEqual('8714100875933');

    expect(results[0].frName).toEqual(
      'Cr\u00e8me glac\u00e9e \u00e0 la vanille de Madagascar',
    );
    expect(results[0].imageUrl).toEqual(
      'https://images.openfoodfacts.org/images/products/325/622/111/6045/front_fr.40.400.jpg',
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should retry when API is temporarily unavailable', async () => {
    fetchMock.mockResponseOnce('Service unavailable', { status: 503 });
    fetchMock.mockResponseOnce(JSON.stringify(getRelatedProductsSearchMock()));

    // Math.Random() will always returns 0.1
    mockRandom([0.1]);

    const results = await relatedProductsService.getRelatedproducts(
      'vanilla-ice-cream-tubs',
      30,
    );

    expect(results).toHaveLength(5);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('should have empty list after retrying rate limited responses', async () => {
    fetchMock.mockResponse('Too many requests', { status: 429 });

    const results = await relatedProductsService.getRelatedproducts(
      'vanilla-ice-cream-tubs',
      30,
    );

    expect(results).toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('should have empty list when product total score is the highest', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(relatedProductsScoresMock));

    const results = await relatedProductsService.getRelatedproducts(
      'vanilla-ice-cream-tubs',
      600,
    );

    expect(results).toEqual([]);
  });

  it('should have empty list when no related product have been found', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(relatedProductsScoresEmptyMock));

    const results = await relatedProductsService.getRelatedproducts(
      'vanilla-ice-cream-tubs',
      222,
    );

    expect(results).toEqual([]);
  });

  it('should have empty list when API throws an error', async () => {
    fetchMock.mockResponse(() => Promise.reject(new Error('Mock error')));

    const results = await relatedProductsService.getRelatedproducts(
      'vanilla-ice-cream-tubs',
      333,
    );

    expect(results).toEqual([]);
  });
});
