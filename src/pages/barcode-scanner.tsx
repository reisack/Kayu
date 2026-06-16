import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  useWindowDimensions,
  ToastAndroid,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Consts from '@/consts';
import { NavigationHandler, NavigationProductProps } from '@/shared-types';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import type { TorchMode } from 'react-native-vision-camera';
import { useBarcodeScannerOutput } from 'react-native-vision-camera-barcode-scanner';

interface Props {
  navigation: NavigationHandler<NavigationProductProps>;
}

const CAMERA_DEVICE_TIMEOUT_MS = 500;

const BarcodeScanner: React.FC<Props> = ({ navigation }) => {
  const productHasBeenScannedRef = useRef(false);
  const cameraDevice = useCameraDevice('back');

  const { t } = useTranslation();
  const { width, fontScale } = useWindowDimensions();

  const isFocused = useIsFocused();
  const [torchMode, setTorchMode] = useState<TorchMode>('off');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    overlay: {
      position: 'absolute',
      padding: width * Consts.style.scaleFactor.oneSixteenth,
      right: 0,
      left: 0,
      alignItems: 'center',
    },
    topOverlay: {
      top: width * Consts.style.scaleFactor.oneSixteenth,
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    bottomOverlay: {
      bottom: width * Consts.style.scaleFactor.oneSixteenth,
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    scanScreenMessage: {
      fontSize: 16 * fontScale,
      color: 'white',
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconButton: {
      width: width * Consts.style.scaleFactor.oneEighth,
      height: width * Consts.style.scaleFactor.oneEighth,
    },
    torchButton: {
      alignSelf: 'flex-end',
    },
  });

  const barcodeScannerOutput = useBarcodeScannerOutput({
    barcodeFormats: ['ean-13'],
    onBarcodeScanned: barcodes => {
      if (productHasBeenScannedRef.current || barcodes.length === 0) {
        return;
      }

      const barcodeValue = barcodes.find(barcode => barcode.rawValue)?.rawValue;
      if (!barcodeValue) {
        return;
      }

      productHasBeenScannedRef.current = true;
      setTorchMode('off');
      navigation.navigate('ProductScreen', {
        eanCode: barcodeValue,
        isRelated: false,
        originProductEanCode: null,
      });
    },
    onError: error => {
      console.log('useBarcodeScannerOutput', error);
    },
  });

  const toggleTorch = () => {
    if (torchMode === 'off') {
      // https://www.flaticon.com/premium-icon/torch_3287897
      setTorchMode('on');
    } else {
      // https://www.flaticon.com/premium-icon/torch_3287903
      setTorchMode('off');
    }
  };

  useEffect(() => {
    productHasBeenScannedRef.current = false;
  }, [isFocused]);

  useEffect(() => {
    if (cameraDevice || !isFocused) {
      return;
    }

    const timeoutId = setTimeout(() => {
      ToastAndroid.show(t('error.CannotFindCamera'), ToastAndroid.LONG);
      navigation.navigate('Home');
    }, CAMERA_DEVICE_TIMEOUT_MS);

    return () => clearTimeout(timeoutId);
  }, [cameraDevice, isFocused, navigation, t]);

  if (!cameraDevice) {
    return null; // Handled with useEffect() for cameraDevice
  } else {
    return (
      <View style={styles.container}>
        <Camera
          device={cameraDevice}
          isActive={true}
          outputs={[barcodeScannerOutput]}
          torchMode={torchMode}
          style={styles.preview}
        />
        <View style={[styles.overlay, styles.topOverlay]}>
          <Text style={styles.scanScreenMessage}>{t('scanBarcodePlease')}</Text>
        </View>
        <View style={[styles.overlay, styles.bottomOverlay]}>
          {torchMode === 'on' ? (
            <Text style={styles.scanScreenMessage}>
              {t('scanBarcodeLightOn')}
            </Text>
          ) : (
            <View />
          )}

          <View style={styles.torchButton}>
            <Pressable
              testID="torch-toggle-button"
              onPress={() => toggleTorch()}>
              {torchMode === 'off' ? (
                <Image
                  testID="torch-on-image"
                  style={styles.iconButton}
                  source={require('assets/images/torch_on.png')}
                />
              ) : (
                <Image
                  style={styles.iconButton}
                  source={require('assets/images/torch_off.png')}
                />
              )}
            </Pressable>
          </View>
        </View>
      </View>
    );
  }
};

export default BarcodeScanner;
