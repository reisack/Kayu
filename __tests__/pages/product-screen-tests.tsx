import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProductScreen from '@/pages/product-screen';
import fetchMock from 'jest-fetch-mock';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import { IActionProps } from 'react-native-floating-action';

// --- Mocks ---

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/consts', () => ({
  style: {
    primaryBackgroundColor: '#fff',
    primaryColor: '#00f',
    scaleFactor: {
      quarter: 0.25,
    },
  },
}));

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: () => ({ width: 400 }),
}));

// Mock FloatingAction to a minimal version
jest.mock('react-native-floating-action', () => {
  const { Pressable, Text } = require('react-native');
  return {
    FloatingAction: ({
      onPressItem,
      actions,
      color,
    }: {
      onPressItem: (name: string) => void;
      actions: IActionProps[];
      color: string;
    }) => (
      <>
        {actions.map((a) => (
          <Pressable
            key={a.name}
            testID={`fab-btn-${a.name}`}
            onPress={() => onPressItem(a.name)}
            style={{ backgroundColor: color }}
          >
            <Text>{a.text}</Text>
          </Pressable>
        ))}
      </>
    ),
  }
});

// Mock ProductDetails and NotFoundProduct
jest.mock('@/components/product-details', () => {
  const { Pressable, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ onNotFoundProduct }: { onNotFoundProduct: () => void }) => (
      <Pressable testID="details-btn" onPress={onNotFoundProduct}>
        <Text>ProductDetails</Text>
      </Pressable>
    ),
  }
});

jest.mock('@/components/not-found-product', () => {
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: () => <View testID="notfound"><Text>NotFoundProduct</Text></View>,
  }
});

// --- Navigation Mock ---
const navigateMock = jest.fn();
const goBackMock = jest.fn();
const navigation = {
  navigate: navigateMock,
  goBack: goBackMock,
};

const route: RouteProp<ParamListBase, 'ProductScreen'> = {
  key: 'screen-key',
  name: 'ProductScreen',
  params: {
    eanCode: 'EAN1234',
    isRelated: false,
    originProductEanCode: null,
  },
};

beforeEach(() => {
  fetchMock.resetMocks();
  navigateMock.mockReset();
  goBackMock.mockReset();
});

describe('ProductScreen', () => {
  it('renders ProductDetails and switches to NotFoundProduct when not found', () => {
    const { getByTestId, queryByTestId } = render(
      <ProductScreen navigation={navigation} route={route} />
    );

    // ProductDetails should be visible
    expect(getByTestId('details-btn')).toBeTruthy();

    // Simulate ProductDetails not found callback
    fireEvent.press(getByTestId('details-btn'));

    // Now NotFoundProduct should be visible
    expect(getByTestId('notfound')).toBeTruthy();
    expect(queryByTestId('details-btn')).toBeNull();
  });

  it('navigates when floating action buttons are pressed', () => {
    const { getByTestId } = render(
      <ProductScreen navigation={navigation} route={route} />
    );

    fireEvent.press(getByTestId('fab-btn-homeButton'));
    expect(navigateMock).toHaveBeenCalledWith('Home');

    fireEvent.press(getByTestId('fab-btn-barcodeButton'));
    expect(navigateMock).toHaveBeenCalledWith('BarcodeScanner');
  });

  it('shows back button if originProductEanCode exists', () => {
    const routeWithOrigin = {
      ...route,
      params: {
        ...route.params,
        originProductEanCode: 'EAN0',
      },
    };

    const { getByTestId } = render(
      <ProductScreen navigation={navigation} route={routeWithOrigin} />
    );

    fireEvent.press(getByTestId('fab-btn-backButton'));
    expect(goBackMock).toHaveBeenCalled();
  });
});
