import React from 'react';
import { act, render } from '@testing-library/react-native';
import VisionCameraBarcodeScannerCamera from '@/services/barcode-scanner/vision-camera-barcode-scanner-camera';
import * as VisionCamera from 'react-native-vision-camera';
import { StyleProp, ViewStyle } from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockCameraComponent = jest.fn((props: Record<string, unknown>) => null);
let lastCameraProps: Record<string, unknown> | undefined;

jest.mock('react-native-vision-camera', () => ({
  Camera: (props: Record<string, unknown>) => {
    lastCameraProps = props;
    return mockCameraComponent(props);
  },
  useCameraDevice: jest.fn(),
  useCameraFormat: jest.fn(),
  useCodeScanner: jest.fn(options => options),
}));

describe('VisionCameraBarcodeScannerCamera', () => {
  const previewStyle: StyleProp<ViewStyle> = { flex: 1 };
  const onBarcodeScannedMock = jest.fn();
  const onCameraUnavailableMock = jest.fn();

  const renderCamera = (
    overrideProps: Partial<
      React.ComponentProps<typeof VisionCameraBarcodeScannerCamera>
    > = {},
  ) =>
    render(
      <VisionCameraBarcodeScannerCamera
        isFocused={true}
        torchMode="off"
        previewStyle={previewStyle}
        cameraUnavailableTimeoutMs={500}
        onBarcodeScanned={onBarcodeScannedMock}
        onCameraUnavailable={onCameraUnavailableMock}
        {...overrideProps}
      />,
    );

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    lastCameraProps = undefined;

    jest.spyOn(VisionCamera, 'useCameraDevice').mockReturnValue({
      id: 'back-camera',
    } as never);
    jest.spyOn(VisionCamera, 'useCameraFormat').mockReturnValue({
      maxFps: 60,
    } as never);
    jest
      .spyOn(VisionCamera, 'useCodeScanner')
      .mockImplementation(options => options);
  });

  it('should render the camera with the selected device, format and torch mode', () => {
    renderCamera({ torchMode: 'on' });

    expect(VisionCamera.useCameraDevice).toHaveBeenCalledWith('back');
    expect(VisionCamera.useCameraFormat).toHaveBeenCalledWith(
      { id: 'back-camera' },
      [{ fps: 30 }],
    );
    expect(lastCameraProps).toEqual(
      expect.objectContaining({
        fps: 60,
        format: { maxFps: 60 },
        device: { id: 'back-camera' },
        isActive: true,
        audio: false,
        torch: 'on',
        style: previewStyle,
      }),
    );
  });

  it('should use 30 fps when the selected format does not expose maxFps', () => {
    jest.spyOn(VisionCamera, 'useCameraFormat').mockReturnValue(undefined);

    renderCamera();

    expect(lastCameraProps).toEqual(
      expect.objectContaining({
        fps: 30,
        format: undefined,
      }),
    );
  });

  it('should notify the first scanned ean-13 barcode value', () => {
    renderCamera();

    const onCodeScanned = (VisionCamera.useCodeScanner as jest.Mock).mock
      .calls[0][0].onCodeScanned as (codes: VisionCamera.Code[]) => void;

    act(() => {
      onCodeScanned([
        { value: '1234567890123', type: 'ean-13' },
        { value: '9999999999999', type: 'ean-13' },
      ]);
    });

    expect(onBarcodeScannedMock).toHaveBeenCalledTimes(1);
    expect(onBarcodeScannedMock).toHaveBeenCalledWith('1234567890123');
  });

  it('should ignore scans without a usable barcode value', () => {
    renderCamera();

    const onCodeScanned = (VisionCamera.useCodeScanner as jest.Mock).mock
      .calls[0][0].onCodeScanned as (codes: VisionCamera.Code[]) => void;

    act(() => {
      onCodeScanned([]);
      onCodeScanned([{ value: undefined, type: 'ean-13' }]);
    });

    expect(onBarcodeScannedMock).not.toHaveBeenCalled();
  });

  it('should notify camera unavailability after the timeout when focused without a device', () => {
    jest.useFakeTimers();
    jest.spyOn(VisionCamera, 'useCameraDevice').mockReturnValue(undefined);

    renderCamera();

    act(() => {
      jest.advanceTimersByTime(499);
    });
    expect(onCameraUnavailableMock).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(onCameraUnavailableMock).toHaveBeenCalledTimes(1);
  });

  it('should not notify camera unavailability when the screen is not focused', () => {
    jest.useFakeTimers();
    jest.spyOn(VisionCamera, 'useCameraDevice').mockReturnValue(undefined);

    renderCamera({ isFocused: false });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onCameraUnavailableMock).not.toHaveBeenCalled();
  });

  it('should clear the unavailable timeout when a device appears before it fires', () => {
    jest.useFakeTimers();
    jest.spyOn(VisionCamera, 'useCameraDevice').mockReturnValue(undefined);

    const { rerender } = renderCamera();

    jest.spyOn(VisionCamera, 'useCameraDevice').mockReturnValue({
      id: 'back-camera',
    } as never);

    rerender(
      <VisionCameraBarcodeScannerCamera
        isFocused={true}
        torchMode="off"
        previewStyle={previewStyle}
        cameraUnavailableTimeoutMs={500}
        onBarcodeScanned={onBarcodeScannedMock}
        onCameraUnavailable={onCameraUnavailableMock}
      />,
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onCameraUnavailableMock).not.toHaveBeenCalled();
  });
});
