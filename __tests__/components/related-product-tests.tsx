import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RelatedProduct from '@/components/related-product';
import Product from '@/classes/product';
import Score from '@/classes/score';
import * as Navigation from '@react-navigation/native'

// --- MOCKS ---

// Mock navigation using jest.spyOn
let pushMock: jest.Mock;

// Mock Consts
jest.mock('@/consts', () => ({
  style: {
    primaryBackgroundColor: '#fff',
    primaryColor: '#0022cc',
    secondaryColor: '#888',
    scaleFactor: {
      oneThirtySecond: 0.03125,
      oneSixteenth: 0.0625,
      quarter: 0.25,
      threeQuarter: 0.75,
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

// --- TEST DATA ---

const product: Product = {
  eanCode: '987654321',
  frName: 'Related Yoghurt',
  imageUrl: 'https://img.com/related.png',
  mainCategory: 'dairy',
  brands: 'brand1',
  categories: ['cat1'],
  score: new Score(null, 12, null, 1, 25, 1),
  nutritionValues: {
    additives: ['test1'],
    eco: 15,
    fat: null,
    novaGroup: 1,
    salt: null,
    sugar: 12
  }
};

const originProductEanCode = '111222333';

// --- TESTS ---

describe('RelatedProduct', () => {
  beforeEach(() => {
    pushMock = jest.fn();
    jest.spyOn(Navigation, 'useNavigation').mockReturnValue({
      push: pushMock,
    });
  });

  it('renders image and product name', () => {
    const { getByText, getByRole } = render(
      <RelatedProduct product={product} originProductEanCode={originProductEanCode} />
    );

    // Product name visible
    expect(getByText('Related Yoghurt')).toBeTruthy();

    // Image is rendered
    expect(getByRole('image')).toBeTruthy();
  });

  it('navigates with correct params on press', () => {
    const { getByRole } = render(
      <RelatedProduct product={product} originProductEanCode={originProductEanCode} />
    );

    // Press the Pressable
    fireEvent.press(getByRole('button'));

    expect(pushMock).toHaveBeenCalledWith('ProductScreen', {
      eanCode: '987654321',
      isRelated: true,
      originProductEanCode: '111222333',
    });
  });
});
