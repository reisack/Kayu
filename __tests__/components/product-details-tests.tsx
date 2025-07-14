import React from 'react';
import fetchMock from 'jest-fetch-mock';
import * as ReactNative from 'react-native';
import {render, waitFor} from '@testing-library/react-native';
import ProductDetails from '@/components/product-details';

// --- MOCKS ---

// Mock child components (so they don't crash render)
jest.mock('@/components/related-product-list', () => 'RelatedProductList');
jest.mock('@/components/product-score-list', () => 'ProductScoreList');

// Mock translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: (k: string) => k}),
}));

// Mock ScoreCalculationService
jest.mock('@/services/score-calculation-service', () =>
  jest.fn().mockImplementation(() => ({
    getScore: () => 42,
  })),
);

// Mock Consts
jest.mock('@/consts', () => ({
  openFoodFactAPIBaseUrl: 'https://api/',
  httpHeaderGetRequest: {},
  style: {
    primaryColor: '#333',
    primaryFontColor: '#000',
    scaleFactor: {
      half: 0.5,
      oneSixteenth: 0.0625,
      threeQuarter: 0.75,
    },
  },
}));

// Mock Product & NutritionValues classes (static empty)
jest.mock('@/classes/product', () => ({
  __esModule: true,
  default: {
    empty: {
      frName: '',
      brands: '',
      imageUrl: '',
      nutritionValues: {},
      categories: [],
    },
  },
}));
jest.mock('@/classes/nutrition-values', () => jest.fn());

// --- TEST DATA ---
const eanCodeMock = '12345';
const onNotFoundMock = jest.fn();

const productApiMock = {
  status: 1,
  product: {
    product_name_fr: 'Choco',
    brands: 'Nestle',
    image_front_url: 'https://img.com/pic.jpg',
    compared_to_category: 'snacks',
    categories_hierarchy: ['snacks', 'sweets'],
    'saturated-fat_100g': 10,
    sugars_100g: 20,
    salt_100g: 0.5,
    additives_tags: ['additive1'],
    nova_group: 2,
    ecoscore_score: 80,
  },
};

// --- TESTS ---

describe('ProductDetails', () => {
  beforeEach(() => {
    jest.spyOn(ReactNative.ToastAndroid, 'show').mockImplementation(() => {});
    jest.spyOn(ReactNative, 'useWindowDimensions').mockReturnValue({
      width: 400,
      height: 800,
      fontScale: 1,
      scale: 1,
    });

    fetchMock.resetMocks();
    onNotFoundMock.mockClear();
  });

  it('shows loader while fetching', () => {
    // fetch never resolves
    const {getByTestId} = render(
      <ProductDetails
        eanCode={eanCodeMock}
        isRelated={false}
        onNotFoundProduct={onNotFoundMock}
      />,
    );

    expect(getByTestId('product-loading')).toBeTruthy();
  });

  it('renders product info on success', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(productApiMock));

    const {getByText, getByTestId} = render(
      <ProductDetails
        eanCode={eanCodeMock}
        isRelated={false}
        onNotFoundProduct={onNotFoundMock}
      />,
    );

    // Wait for data to load
    await waitFor(() => {
      expect(getByText('Choco')).toBeTruthy();
    });

    // Renders image
    // Can't check uri, but can check there is one image in tree
    expect(getByTestId('product-image')).toBeTruthy();
  });

  it('calls onNotFoundProduct if status is not 1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({status: 0, product: null}));

    render(
      <ProductDetails
        eanCode={eanCodeMock}
        isRelated={false}
        onNotFoundProduct={onNotFoundMock}
      />,
    );

    await waitFor(() => {
      expect(onNotFoundMock).toHaveBeenCalled();
    });
  });

  it('calls onNotFoundProduct on fetch error', async () => {
    fetchMock.mockRejectOnce(new Error('Network error'));

    render(
      <ProductDetails
        eanCode={eanCodeMock}
        isRelated={false}
        onNotFoundProduct={onNotFoundMock}
      />,
    );

    await waitFor(() => {
      expect(onNotFoundMock).toHaveBeenCalled();
    });
  });
});
