import React, { useEffect } from 'react';
import {
  Camera,
  Code,
  useCameraDevice,
  useCameraFormat,
  useCodeScanner,
} from 'react-native-vision-camera';
import { BarcodeScannerCameraProps } from '@/services/barcode-scanner/barcode-scanner-camera-interface';

const VisionCameraBarcodeScannerCamera: React.FC<BarcodeScannerCameraProps> = ({
  isFocused,
  torchMode,
  previewStyle,
  cameraUnavailableTimeoutMs,
  onBarcodeScanned,
  onCameraUnavailable,
}) => {
  const cameraDevice = useCameraDevice('back');
  const cameraFormat = useCameraFormat(cameraDevice, [{ fps: 30 }]);
  const fps = cameraFormat?.maxFps ?? 30;

  const onBarcodeRead = useCodeScanner({
    codeTypes: ['ean-13'],
    onCodeScanned: (codes: Code[]) => {
      if (codes?.length > 0) {
        const code = codes[0];
        if (code?.value) {
          onBarcodeScanned(code.value);
        }
      }
    },
  });

  useEffect(() => {
    if (cameraDevice || !isFocused) {
      return;
    }

    const timeoutId = setTimeout(() => {
      onCameraUnavailable();
    }, cameraUnavailableTimeoutMs);

    return () => clearTimeout(timeoutId);
  }, [
    cameraDevice,
    cameraUnavailableTimeoutMs,
    isFocused,
    onCameraUnavailable,
  ]);

  if (!cameraDevice) {
    return null;
  }

  return (
    <Camera
      fps={fps}
      format={cameraFormat}
      device={cameraDevice}
      isActive={true}
      audio={false}
      torch={torchMode}
      style={previewStyle}
      codeScanner={onBarcodeRead}
    />
  );
};

export default VisionCameraBarcodeScannerCamera;
