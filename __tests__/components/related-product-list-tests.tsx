import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import RelatedProductList from '@/components/related-product-list';
import Product from '@/classes/product';
import Score from '@/classes/score';
import NutritionValues from '@/classes/nutrition-values';

// --- MOCKS ---

// Mock translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock Consts
jest.mock('@/consts', () => ({
  style: {
    secondaryBackgroundColor: '#abc',
    secondaryColor: '#222',
    primaryColor: '#335',
    scaleFactor: {
      oneSixteenth: 0.0625,
      oneEighth: 0.125,
      oneThirtySecond: 0.03125,
    },
  },
}));

// Mock useWindowDimensions
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: () => ({
    width: 400,
    fontScale: 1,
  }),
}));

const baseProduct: Product = {
  eanCode: '111',
  score: new Score(3, 5, null, 2, 6, 2),
  frName: '',
  brands: '',
  imageUrl: '',
  nutritionValues: new NutritionValues(),
  category: {
    mainCategory: 'snacks',
    categories: [],
  },
};

// --- Mock RelatedProduct ---
jest.mock('@/components/related-product', () => {
  const { Text } = require('react-native');
  return ({ product }: { product: Product }) => (
    <Text>{`related-${product.eanCode}`}</Text>
  );
});

// --- Mock RelatedProductsService ---
const mockGetRelatedProducts = jest.fn();
jest.mock('@/services/related-products-service', () => {
  return jest.fn().mockImplementation(() => ({
    getRelatedproducts: mockGetRelatedProducts,
  }));
});

// --- SETUP ---
beforeEach(() => {
  mockGetRelatedProducts.mockReset();
});

// --- TESTS ---
describe('RelatedProductList', () => {
  it('renders loader initially', () => {
    mockGetRelatedProducts.mockReturnValue(new Promise(() => {}));
    const { getByText } = render(<RelatedProductList product={baseProduct} />);
    expect(getByText('RelatedProductsTitle')).toBeTruthy();
    // ActivityIndicator is present (no default testID, check by type or snapshot if needed)
  });

  it('renders related products after fetch', async () => {
    const relatedProducts: Product[] = [
      { ...baseProduct, eanCode: '222' },
      { ...baseProduct, eanCode: '333' },
    ];
    mockGetRelatedProducts.mockResolvedValueOnce(relatedProducts);

    const { getByText, queryByTestId } = render(
      <RelatedProductList product={baseProduct} />,
    );

    // Wait for loading to finish and related products to be rendered
    await waitFor(() => {
      expect(getByText('related-222')).toBeTruthy();
      expect(getByText('related-333')).toBeTruthy();
      expect(queryByTestId('related-products-loader')).toBeNull();
    });
  });

  it('renders nothing when no related products', async () => {
    mockGetRelatedProducts.mockResolvedValueOnce([]);
    const { queryByText, queryByTestId } = render(
      <RelatedProductList product={baseProduct} />,
    );

    await waitFor(() => {
      expect(queryByText(/related-/)).toBeNull();
      expect(queryByTestId('related-products-loader')).toBeNull();
    });
  });
});
