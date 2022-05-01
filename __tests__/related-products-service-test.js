import getRelatedproducts from '../src/services/related-products-service';

describe('Related products service', () => {
  it('should have empty list when product total score is the highest', async () => {
    const relatedProductsJSON = require('./mocks/related-products-scores-mock.json');
    fetch.mockResponseOnce(JSON.stringify(relatedProductsJSON));

    const results = await getRelatedproducts('vanilla-ice-cream-tubs', 600);

    expect(results).toEqual([]);
  });

  it('should have empty list when no related product have been found', async () => {
    const relatedProductsJSON = require('./mocks/related-products-scores-empty-mock.json');
    fetch.mockResponseOnce(JSON.stringify(relatedProductsJSON));

    const results = await getRelatedproducts('categoryDoesNotExist', 222);

    expect(results).toEqual([]);
  });

  it('should have empty list when API throws an error', async () => {
    fetch.mockResponse(() => Promise.reject('error'));

    const results = await getRelatedproducts('vanilla-ice-cream-tubs', 333);

    expect(results).toEqual([]);
  });
});
