import React from 'react';
import { render } from '@testing-library/react-native';
import ProductScoreList from '@/components/product-score-list';
import { ProductInformationEnum } from '@/enums';
import Product from '@/classes/product';
import Score from '@/classes/score';

// --- MOCKS ---

// Mock translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock Consts
jest.mock('@/consts', () => ({
  style: {
    tertiaryBackgroundColor: '#eee',
    primaryFontColor: '#111',
    scaleFactor: {
      oneSixteenth: 0.0625,
      oneEighth: 0.125,
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

// Mock ProductScore as a simple functional component that exposes props for assertion
jest.mock(
  '@/components/product-score',
  () =>
    (props: {
      score: number;
      nutritionValue: number | string[];
      productInfo: ProductInformationEnum;
    }) => {
      const { Text } = require('react-native');
      return <Text>{JSON.stringify(props)}</Text>;
    },
);

// --- TESTS ---

describe('ProductScoreList', () => {
  it('renders title and only scores with available values', () => {
    const mockProduct: Product = {
      nutritionValues: {
        fat: 10,
        salt: 2,
        sugar: null, // will not render
        novaGroup: 1,
        eco: 5,
        additives: ['E100'],
      },
      score: new Score(5, null, 1, 4, 3, 2),
      brands: 'brand1',
      eanCode: '12345',
      frName: 'frName1',
      imageUrl: 'urlImage',
      category: {
        mainCategory: 'cat1',
        categories: ['cat1'],
      },
    };

    const { getByText, queryByText } = render(
      <ProductScoreList product={mockProduct} />,
    );

    // Should render the translated title
    expect(getByText('ScoreTitle')).toBeTruthy();

    // Should render ProductScore (as JSON string) for non-null nutrition values/scores

    expect(
      getByText(
        JSON.stringify({
          score: 5,
          nutritionValue: 10,
          productInfo: ProductInformationEnum.fat,
        }),
      ),
    ).toBeTruthy();

    expect(
      getByText(
        JSON.stringify({
          score: 1,
          nutritionValue: 2,
          productInfo: ProductInformationEnum.salt,
        }),
      ),
    ).toBeTruthy();

    // Should not render ProductScore for missing sugar (null)
    expect(
      queryByText(
        JSON.stringify({
          score: null,
          nutritionValue: null,
          productInfo: ProductInformationEnum.sugar,
        }),
      ),
    ).toBeNull();

    expect(
      getByText(
        JSON.stringify({
          score: 4,
          nutritionValue: 1,
          productInfo: ProductInformationEnum.novaGroup,
        }),
      ),
    ).toBeTruthy();

    expect(
      getByText(
        JSON.stringify({
          score: 3,
          nutritionValue: 5,
          productInfo: ProductInformationEnum.eco,
        }),
      ),
    ).toBeTruthy();

    expect(
      getByText(
        JSON.stringify({
          score: 2,
          nutritionValue: ['E100'],
          productInfo: ProductInformationEnum.additives,
        }),
      ),
    ).toBeTruthy();
  });

  it('renders empty View for missing scores', () => {
    const mockProduct: Product = {
      nutritionValues: {
        fat: null,
        salt: null,
        sugar: 15,
        novaGroup: null,
        eco: null,
        additives: ['E200'],
      },
      score: new Score(null, 4, null, null, null, 1),
      brands: 'brand1',
      eanCode: '12345',
      frName: 'frName1',
      imageUrl: 'urlImage',
      category: {
        mainCategory: 'cat1',
        categories: ['cat1'],
      },
    };

    const { getByText, queryByText } = render(
      <ProductScoreList product={mockProduct} />,
    );
    expect(getByText('ScoreTitle')).toBeTruthy();
    expect(
      getByText(
        JSON.stringify({
          score: 4,
          nutritionValue: 15,
          productInfo: ProductInformationEnum.sugar,
        }),
      ),
    ).toBeTruthy();
    expect(
      getByText(
        JSON.stringify({
          score: 1,
          nutritionValue: ['E200'],
          productInfo: ProductInformationEnum.additives,
        }),
      ),
    ).toBeTruthy();

    // Should not render fat score
    expect(
      queryByText(
        JSON.stringify({
          score: expect.anything(),
          nutritionValue: expect.anything(),
          productInfo: ProductInformationEnum.fat,
        }),
      ),
    ).toBeNull();
  });
});
