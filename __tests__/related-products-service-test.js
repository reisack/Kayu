import getRelatedproducts from '../src/services/related-products-service';
import {mockRandom, resetMockRandom} from 'jest-mock-random';

describe('Related products service', () => {
  it('should have list when product total score is not the highest', async () => {
    const relatedProductsJSON = require('./mocks/related-products-scores-mock.json');
    fetch.mockResponseOnce(JSON.stringify(relatedProductsJSON));
    const relatedProductsSelectedJSON = require('./mocks/related-products-selected-mock.json');
    fetch.mockResponseOnce(JSON.stringify(relatedProductsSelectedJSON));

    // Math.Random() always returns 0.1
    mockRandom([0.1]);

    const results = await getRelatedproducts('vanilla-ice-cream-tubs', 30);

    expect(results[0].code).toEqual('8714100635698');
    expect(results[1].code).toEqual('7613034528971');
    expect(results[2].code).toEqual('8714100875933');
    expect(results[3].code).toEqual('40875125');
    expect(results[4].code).toEqual('3256221116045');

    resetMockRandom();
  });

  it('should have empty list when related products does not have all informations', async () => {
    const relatedProductsJSON = require('./mocks/related-products-scores-mock.json');
    fetch.mockResponseOnce(JSON.stringify(relatedProductsJSON));

    // Query for all informations about selected related products throws an error
    fetch.mockResponseOnce(() => Promise.reject('error'));

    // Math.Random() always returns 0.1
    mockRandom([0.1]);

    const results = await getRelatedproducts('vanilla-ice-cream-tubs', 30);

    expect(results).toEqual([]);

    resetMockRandom();
  });

  it('should have empty list when product total score is the highest', async () => {
    const relatedProductsJSON = require('./mocks/related-products-scores-mock.json');
    fetch.mockResponseOnce(JSON.stringify(relatedProductsJSON));

    const results = await getRelatedproducts('vanilla-ice-cream-tubs', 600);

    expect(results).toEqual([]);
  });

  it('should have empty list when no related product have been found', async () => {
    const relatedProductsJSON = require('./mocks/related-products-scores-empty-mock.json');
    fetch.mockResponseOnce(JSON.stringify(relatedProductsJSON));

    const results = await getRelatedproducts('vanilla-ice-cream-tubs', 222);

    expect(results).toEqual([]);
  });

  it('should have empty list when API throws an error', async () => {
    fetch.mockResponse(() => Promise.reject('error'));

    const results = await getRelatedproducts('vanilla-ice-cream-tubs', 333);

    expect(results).toEqual([]);
  });
});
