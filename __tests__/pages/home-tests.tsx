import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Home from '@/pages/home';
import fetchMock from 'jest-fetch-mock';
import { Linking } from 'react-native';
import { DefaultNavigationHandler } from '@/shared-types';
import * as VisionCamera from 'react-native-vision-camera';

// --- MOCKS ---

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/consts', () => ({
  style: {
    primaryBackgroundColor: '#fff',
    primaryColor: '#0071c1',
    primaryFontColor: '#111',
    secondaryFontColor: '#333',
    scaleFactor: {
      oneEighth: 0.125,
      oneSixteenth: 0.0625,
      half: 0.5,
    },
  },
}));

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: () => ({
    width: 400,
    fontScale: 1,
  }),
}));

jest.mock('react-native-vision-camera', () => ({
  useCameraPermission: jest.fn(),
}));

jest.mock('../../assets/images/barcode.png', () => 1);

const navigateMock = jest.fn();
const requestPermissionMock = jest.fn();

// --- SETUP ---
beforeEach(() => {
  fetchMock.resetMocks();
  navigateMock.mockReset();
  requestPermissionMock.mockReset();

  jest.spyOn(VisionCamera, 'useCameraPermission').mockReturnValue({
    hasPermission: false,
    requestPermission: requestPermissionMock,
  });
});

const navigation: DefaultNavigationHandler = {
  navigate: navigateMock,
  goBack: jest.fn(),
};

// --- TESTS ---

describe('Home', () => {
  it('renders permission message and calls requestPermission on button press', () => {
    const { getByText } = render(<Home navigation={navigation} />);
    expect(getByText('permission.message')).toBeTruthy();
    expect(getByText('permission.messageComplement')).toBeTruthy();

    // Simulate button press
    fireEvent.press(getByText('permission.validate'));
    expect(requestPermissionMock).toHaveBeenCalled();
  });

  it('renders scan UI and navigates on press when hasPermission', () => {
    jest.spyOn(VisionCamera, 'useCameraPermission').mockReturnValue({
      hasPermission: true,
      requestPermission: requestPermissionMock,
    });

    const { getByText, getByTestId } = render(<Home navigation={navigation} />);
    expect(getByText('scanBarcode')).toBeTruthy();
    // Press barcode scan button
    fireEvent.press(getByTestId('barcode-scanner-button'));
    expect(navigateMock).toHaveBeenCalledWith('BarcodeScanner');
  });

  it('opens privacy link', async () => {
    const canOpenURLMock = jest
      .spyOn(Linking, 'canOpenURL')
      .mockResolvedValue(true);
    const openURLMock = jest
      .spyOn(Linking, 'openURL')
      .mockResolvedValue(undefined);

    const { getByText } = render(<Home navigation={navigation} />);
    fireEvent.press(getByText('privacy'));
    await waitFor(() => {
      expect(canOpenURLMock).toHaveBeenCalledWith(
        'https://reisack.github.io/Kayu/privacy.html',
      );
      expect(openURLMock).toHaveBeenCalledWith(
        'https://reisack.github.io/Kayu/privacy.html',
      );
    });

    canOpenURLMock.mockReset();
    openURLMock.mockReset();
  });

  it('Cannot open privacy link', async () => {
    const canOpenURLMock = jest
      .spyOn(Linking, 'canOpenURL')
      .mockResolvedValue(false);
    const openURLMock = jest
      .spyOn(Linking, 'openURL')
      .mockResolvedValue(undefined);

    const { getByText } = render(<Home navigation={navigation} />);
    fireEvent.press(getByText('privacy'));
    await waitFor(() => {
      expect(canOpenURLMock).toHaveBeenCalledWith(
        'https://reisack.github.io/Kayu/privacy.html',
      );
      expect(openURLMock).not.toHaveBeenCalled();
    });

    canOpenURLMock.mockReset();
    openURLMock.mockReset();
  });
});
