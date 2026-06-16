import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import fetchMock from 'jest-fetch-mock';
import * as ReactNative from 'react-native';
import * as VisionCamera from 'react-native-vision-camera';
import BarcodeScanner from '@/pages/barcode-scanner';
import { NavigationHandler, NavigationProductProps } from '@/shared-types';

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

let cameraProps: Record<string, unknown> | undefined;

jest.mock('react-native-vision-camera', () => {
  const cameraDeviceMock = {
    id: 'mock-device',
    formats: [],
    hardwareLevel: 'full',
    hasFlash: true,
    hasTorch: true,
    physicalDevices: [],
    position: 'back',
    name: 'mock-camera',
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
  };

  return {
    Camera: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => {
      cameraProps = props;
      return <>{children}</>;
    },
    useCameraDevice: jest.fn().mockReturnValue(cameraDeviceMock),
  };
});

jest.mock(
  'react-native-vision-camera-barcode-scanner',
  () => ({
    useBarcodeScannerOutput: jest.fn(options => ({
      options,
      type: 'mock-barcode-output',
    })),
  }),
  { virtual: true },
);

jest.mock('../../assets/images/torch_on.png', () => 1);
jest.mock('../../assets/images/torch_off.png', () => 1);

const barcodeScannerModule = jest.requireMock(
  'react-native-vision-camera-barcode-scanner',
) as {
  useBarcodeScannerOutput: jest.Mock;
};

const navigateMock = jest.fn();

const navigation: NavigationHandler<NavigationProductProps> = {
  navigate: navigateMock,
  push: jest.fn(),
};

beforeEach(() => {
  fetchMock.resetMocks();
  navigateMock.mockReset();
  jest.clearAllMocks();
  jest.useRealTimers();
  cameraProps = undefined;

  const cameraDeviceMock = {
    id: 'mock-device',
    formats: [],
    hardwareLevel: 'full',
    hasFlash: true,
    hasTorch: true,
    physicalDevices: [],
    position: 'back',
    name: 'mock-camera',
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
  };

  jest.spyOn(VisionCamera, 'useCameraDevice').mockReturnValue(cameraDeviceMock);
  barcodeScannerModule.useBarcodeScannerOutput.mockImplementation(options => ({
    options,
    type: 'mock-barcode-output',
  }));
});

describe('BarcodeScanner', () => {
  it('configures the barcode scanner output for ean-13 and passes it to the camera', () => {
    render(<BarcodeScanner navigation={navigation} />);

    expect(barcodeScannerModule.useBarcodeScannerOutput).toHaveBeenCalledWith(
      expect.objectContaining({
        barcodeFormats: ['ean-13'],
        onBarcodeScanned: expect.any(Function),
        onError: expect.any(Function),
      }),
    );
    expect(cameraProps).toEqual(
      expect.objectContaining({
        outputs: [
          expect.objectContaining({
            type: 'mock-barcode-output',
          }),
        ],
        torchMode: 'off',
      }),
    );
  });

  it('renders scan message and toggles torch', () => {
    const { getByText, getByTestId } = render(
      <BarcodeScanner navigation={navigation} />,
    );

    expect(getByText('scanBarcodePlease')).toBeTruthy();
    expect(getByTestId('torch-on-image')).toBeTruthy();

    fireEvent.press(getByTestId('torch-toggle-button'));
    expect(getByText('scanBarcodeLightOn')).toBeTruthy();

    fireEvent.press(getByTestId('torch-toggle-button'));
    expect(getByText('scanBarcodePlease')).toBeTruthy();
  });

  it('navigates with correct params on successful barcode scan', () => {
    render(<BarcodeScanner navigation={navigation} />);

    const onBarcodeScanned =
      barcodeScannerModule.useBarcodeScannerOutput.mock.calls[0][0]
        .onBarcodeScanned;

    act(() => {
      onBarcodeScanned([
        {
          rawValue: '1234567890123',
        },
      ]);
    });

    expect(navigateMock).toHaveBeenCalledWith('ProductScreen', {
      eanCode: '1234567890123',
      isRelated: false,
      originProductEanCode: null,
    });
  });

  it('uses the first valid barcode value and only navigates once', () => {
    render(<BarcodeScanner navigation={navigation} />);

    const onBarcodeScanned =
      barcodeScannerModule.useBarcodeScannerOutput.mock.calls[0][0]
        .onBarcodeScanned;

    act(() => {
      onBarcodeScanned([
        {
          rawValue: undefined,
        },
        {
          rawValue: '1234567890123',
        },
      ]);
    });

    expect(navigateMock).toHaveBeenCalledWith('ProductScreen', {
      eanCode: '1234567890123',
      isRelated: false,
      originProductEanCode: null,
    });
    expect(navigateMock).toHaveBeenCalledTimes(1);

    act(() => {
      onBarcodeScanned([
        {
          rawValue: '9999999999999',
        },
      ]);
    });

    expect(navigateMock).toHaveBeenCalledTimes(1);
  });

  it('ignores scans when no barcode contains a value', () => {
    render(<BarcodeScanner navigation={navigation} />);

    const onBarcodeScanned =
      barcodeScannerModule.useBarcodeScannerOutput.mock.calls[0][0]
        .onBarcodeScanned;

    act(() => {
      onBarcodeScanned([
        {
          rawValue: undefined,
        },
      ]);
    });

    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('shows toast and navigates home if camera device not found', async () => {
    const showToastMock = jest
      .spyOn(ReactNative.ToastAndroid, 'show')
      .mockImplementation(jest.fn());
    jest.useFakeTimers();

    const { rerender } = render(<BarcodeScanner navigation={navigation} />);

    jest.spyOn(VisionCamera, 'useCameraDevice').mockReturnValue(undefined);
    rerender(<BarcodeScanner navigation={navigation} />);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(showToastMock).toHaveBeenCalledWith('error.CannotFindCamera', 0);
      expect(navigateMock).toHaveBeenCalledWith('Home');
    });
  });

  it('shows toast and navigates home when no camera device is found on mount', async () => {
    const showToastMock = jest
      .spyOn(ReactNative.ToastAndroid, 'show')
      .mockImplementation(jest.fn());
    jest.useFakeTimers();

    jest.spyOn(VisionCamera, 'useCameraDevice').mockReturnValue(undefined);

    render(<BarcodeScanner navigation={navigation} />);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(showToastMock).toHaveBeenCalledWith('error.CannotFindCamera', 0);
      expect(navigateMock).toHaveBeenCalledWith('Home');
    });
  });
});
