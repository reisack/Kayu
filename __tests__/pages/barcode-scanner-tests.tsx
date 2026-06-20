import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import BarcodeScanner from '@/pages/barcode-scanner';
import fetchMock from 'jest-fetch-mock';
import * as VisionCamera from 'react-native-vision-camera';

const mockToastShow = jest.fn();

// --- MOCKS ---

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/consts', () => ({
  style: {
    primaryBackgroundColor: '#fff',
    primaryColor: '#229',
    secondaryFontColor: '#444',
    scaleFactor: {
      oneEighth: 0.125,
      oneSixteenth: 0.0625,
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

jest.mock('@react-navigation/native', () => ({
  useIsFocused: jest.fn().mockReturnValue(true),
}));

jest.mock('react-native-vision-camera', () => {
  const cameraDeviceMock = { id: 'mock-device' };
  const cameraFormatMock = { maxFps: 60 };
  return {
    useCameraDevice: jest.fn().mockReturnValue(cameraDeviceMock),
    useCameraFormat: jest.fn().mockReturnValue(cameraFormatMock),
    useCodeScanner: jest.fn(opts => opts.onCodeScanned),
    Camera: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  };
});

jest.mock('../../assets/images/torch_on.png', () => 1);
jest.mock('../../assets/images/torch_off.png', () => 1);

jest.mock('@/services/toast-service', () => ({
  __esModule: true,
  default: {
    show: (...args: unknown[]) => mockToastShow(...args),
  },
}));

const navigateMock = jest.fn();

// --- TEST NAVIGATION PROP TYPE ---
import { NavigationHandler, NavigationProductProps } from '@/shared-types';
const navigation: NavigationHandler<NavigationProductProps> = {
  navigate: navigateMock,
  push: jest.fn(),
};

beforeEach(() => {
  fetchMock.resetMocks();
  navigateMock.mockReset();
  mockToastShow.mockReset();
  jest.useRealTimers();
});

describe('BarcodeScanner', () => {
  it('renders scan message and toggles torch', () => {
    const { getByText, getByTestId } = render(
      <BarcodeScanner navigation={navigation} />,
    );

    expect(getByText('scanBarcodePlease')).toBeTruthy();

    // Torch off initially, torch_on image present
    expect(getByTestId('torch-on-image')).toBeTruthy();

    // Press to turn torch on
    fireEvent.press(getByTestId('torch-toggle-button'));
    // Torch text "scanBarcodeLightOn" should appear now
    expect(getByText('scanBarcodeLightOn')).toBeTruthy();
    // Press again to turn torch off (toggles state)
    fireEvent.press(getByTestId('torch-toggle-button'));
    expect(getByText('scanBarcodePlease')).toBeTruthy();
  });

  it('navigates with correct params on successful barcode scan', () => {
    const useCodeScannerSpy = jest
      .spyOn(VisionCamera, 'useCodeScanner')
      .mockImplementation(codeScanner => codeScanner);

    render(<BarcodeScanner navigation={navigation} />);

    const code: VisionCamera.Code = { value: '1234567890123', type: 'ean-13' };
    const frame: VisionCamera.CodeScannerFrame = { height: 10, width: 10 };
    const onCodeScanned = useCodeScannerSpy.mock.calls[0][0].onCodeScanned;
    onCodeScanned([code], frame);

    expect(navigateMock).toHaveBeenCalledWith('ProductScreen', {
      eanCode: '1234567890123',
      isRelated: false,
      originProductEanCode: null,
    });
  });

  it('ignores empty scans and only navigates once after the first valid scan', () => {
    const useCodeScannerSpy = jest
      .spyOn(VisionCamera, 'useCodeScanner')
      .mockImplementation(codeScanner => codeScanner);

    render(<BarcodeScanner navigation={navigation} />);

    const frame: VisionCamera.CodeScannerFrame = { height: 10, width: 10 };
    const getOnCodeScanned = () =>
      useCodeScannerSpy.mock.calls.at(-1)!![0].onCodeScanned;

    act(() => {
      getOnCodeScanned()([{ value: undefined, type: 'ean-13' }], frame);
    });

    expect(navigateMock).not.toHaveBeenCalled();

    act(() => {
      getOnCodeScanned()([{ value: '1234567890123', type: 'ean-13' }], frame);
    });

    expect(navigateMock).toHaveBeenCalledTimes(1);

    act(() => {
      getOnCodeScanned()([{ value: '9999999999999', type: 'ean-13' }], frame);
    });

    expect(navigateMock).toHaveBeenCalledTimes(1);
  });

  it('shows toast and navigates home if camera device not found', async () => {
    jest.useFakeTimers();

    // 1. First render: cameraDevice exists
    jest.spyOn(VisionCamera, 'useCameraDevice').mockReturnValue({
      id: 'mock-device',
      formats: [],
      hardwareLevel: 'full',
      hasFlash: true,
      hasTorch: true,
      physicalDevices: [],
      position: 'front',
      name: '',
      minFocusDistance: 0,
      isMultiCam: false,
      minZoom: 0,
      maxZoom: 0,
      neutralZoom: 0,
      minExposure: 0,
      maxExposure: 0,
      supportsLowLightBoost: false,
      supportsRawCapture: false,
      supportsFocus: false,
      sensorOrientation: 'portrait',
    });

    const { rerender } = render(<BarcodeScanner navigation={navigation} />);

    // 2. Update: cameraDevice becomes undefined
    jest.spyOn(VisionCamera, 'useCameraDevice').mockReturnValue(undefined);
    rerender(<BarcodeScanner navigation={navigation} />);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(mockToastShow).toHaveBeenCalledWith('error.CannotFindCamera');
      expect(navigateMock).toHaveBeenCalledWith('Home');
    });
  });

  it('shows toast and navigates home when no camera device is found on mount', async () => {
    jest.useFakeTimers();

    jest.spyOn(VisionCamera, 'useCameraDevice').mockReturnValue(undefined);

    render(<BarcodeScanner navigation={navigation} />);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(mockToastShow).toHaveBeenCalledWith('error.CannotFindCamera');
      expect(navigateMock).toHaveBeenCalledWith('Home');
    });
  });
});
