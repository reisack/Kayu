import React, { useEffect } from 'react';
import { View } from 'react-native';
import { BarcodeScannerCameraProps } from '../src/services/barcode-scanner/barcode-scanner-camera-interface';

export const E2E_BARCODE_SCANNER_CAMERA_MOCK = {
  barcode: '8714100635698',
  scanDelayMs: 250,
};

const E2EBarcodeScannerCamera: React.FC<BarcodeScannerCameraProps> = ({
  isFocused,
  previewStyle,
  onBarcodeScanned,
}) => {
  useEffect(() => {
    if (!isFocused) {
      return;
    }

    const timeoutId = setTimeout(() => {
      onBarcodeScanned(E2E_BARCODE_SCANNER_CAMERA_MOCK.barcode);
    }, E2E_BARCODE_SCANNER_CAMERA_MOCK.scanDelayMs);

    return () => clearTimeout(timeoutId);
  }, [isFocused, onBarcodeScanned]);

  return <View testID="barcode-scanner-camera-mock" style={previewStyle} />;
};

export default E2EBarcodeScannerCamera;
