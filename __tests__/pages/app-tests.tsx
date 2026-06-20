import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from '../../src/App';

const mockScreen = jest.fn();
const mockNavigator = jest.fn(({ children }: { children: React.ReactNode }) => (
  <>{children}</>
));
const mockNavigationContainer = jest.fn(
  ({ children }: { children: React.ReactNode }) => <>{children}</>,
);
const mockInitAdditiveScoreInformations = jest.fn();
const mockToastShow = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) =>
    mockNavigationContainer({ children }),
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) =>
      mockNavigator({ children }),
    Screen: (props: unknown) => {
      mockScreen(props);
      return null;
    },
  }),
}));

jest.mock('@/pages/home', () => 'Home');
jest.mock('@/pages/barcode-scanner', () => 'BarcodeScanner');
jest.mock('@/pages/product-screen', () => 'ProductScreen');

jest.mock('@/services/additive-informations-service', () => ({
  __esModule: true,
  default: {
    initAdditiveScoreInformations: () => mockInitAdditiveScoreInformations(),
  },
}));

jest.mock('@/services/toast-service', () => ({
  __esModule: true,
  default: {
    show: (...args: unknown[]) => mockToastShow(...args),
  },
}));

describe('App', () => {
  beforeEach(() => {
    mockScreen.mockClear();
    mockNavigator.mockClear();
    mockNavigationContainer.mockClear();
    mockInitAdditiveScoreInformations.mockReset();
    mockToastShow.mockReset();
  });

  it('should register the application screens without headers', async () => {
    mockInitAdditiveScoreInformations.mockResolvedValue(undefined);

    render(<App />);

    await waitFor(() => {
      expect(mockInitAdditiveScoreInformations).toHaveBeenCalledTimes(1);
    });

    expect(mockNavigationContainer).toHaveBeenCalledTimes(1);
    expect(mockNavigator).toHaveBeenCalledTimes(1);
    expect(mockScreen).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        name: 'Home',
        component: 'Home',
        options: { headerShown: false },
      }),
    );
    expect(mockScreen).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        name: 'BarcodeScanner',
        component: 'BarcodeScanner',
        options: { headerShown: false },
      }),
    );
    expect(mockScreen).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        name: 'ProductScreen',
        component: 'ProductScreen',
        options: { headerShown: false },
      }),
    );
  });

  it('should not show a toast when additive initialization succeeds', async () => {
    mockInitAdditiveScoreInformations.mockResolvedValue(undefined);

    render(<App />);

    await waitFor(() => {
      expect(mockInitAdditiveScoreInformations).toHaveBeenCalledTimes(1);
    });

    expect(mockToastShow).not.toHaveBeenCalled();
  });

  it('should show a translated toast when additive initialization fails', async () => {
    mockInitAdditiveScoreInformations.mockRejectedValue(
      new Error('initialization failed'),
    );

    render(<App />);

    await waitFor(() => {
      expect(mockToastShow).toHaveBeenCalledWith(
        'error.initAdditiveScoreInformations',
      );
    });
  });
});
