import React from 'react';
import { render } from '@testing-library/react-native';
import NotFoundProduct from '@/components/not-found-product';

// Mock useTranslation from react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === 'notFoundProduct') return 'Product not found';
      return key;
    },
  }),
}));

// Mock useWindowDimensions
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: () => ({
    width: 400,
    fontScale: 1,
  }),
}));

// Mock Consts (adjust path if needed)
jest.mock('@/consts', () => ({
  style: {
    primaryBackgroundColor: '#fff',
    secondaryColor: '#333',
    scaleFactor: {
      oneSixteenth: 0.0625,
      third: 0.3333,
      oneEighth: 0.125,
    },
  },
}));

// Mock image require
jest.mock('../../assets/images/sad.png', () => 1);

describe('NotFoundProduct', () => {
  it('renders Image and message', () => {
    const { getByText, getByTestId } = render(<NotFoundProduct />);
    // Check the message text
    expect(getByText('Product not found')).toBeTruthy();
    // Check the image is rendered
    expect(getByTestId('not-found-image')).toBeTruthy();
  });
});
