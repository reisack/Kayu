import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export type TorchMode = 'off' | 'on';

export interface BarcodeScannerCameraProps {
  isFocused: boolean;
  torchMode: TorchMode;
  previewStyle: StyleProp<ViewStyle>;
  cameraUnavailableTimeoutMs: number;
  onBarcodeScanned: (barcode: string) => void;
  onCameraUnavailable: () => void;
}

export type BarcodeScannerCameraImplementation =
  React.FC<BarcodeScannerCameraProps>;
