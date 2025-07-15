import { mockRandom, resetMockRandom } from 'jest-mock-random';
import fetchMock from 'jest-fetch-mock';
import RelatedProductsService from '@/services/related-products-service';

import relatedProductsScoresMock from './mocks/related-products-scores-mock.json';
import relatedProductsSelectedMock from './mocks/related-products-selected-mock.json';
import relatedProductsScoresEmptyMock from './mocks/related-products-scores-empty-mock.json';

describe('Related products service', () => {
  let relatedProductsService: RelatedProductsService;

  beforeEach(() => {
    relatedProductsService = new RelatedProductsService();
  });

  it('should have list when product total score is not the highest', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(relatedProductsScoresMock));
    fetchMock.mockResponseOnce(JSON.stringify(relatedProductsSelectedMock));

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

    resetMockRandom();
  });

  it('should have empty list when related products does not have all informations', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(relatedProductsScoresMock));

    // Query for all informations about selected related products throws an error
    fetchMock.mockResponseOnce(() => Promise.reject(new Error('Mock error')));

    // Math.Random() will always returns 0.1
    mockRandom([0.1]);

    const results = await relatedProductsService.getRelatedproducts(
      'vanilla-ice-cream-tubs',
      30,
    );

    expect(results).toEqual([]);

    resetMockRandom();
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
