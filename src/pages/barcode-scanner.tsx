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
import {
  Camera,
  Code,
  useCameraDevice,
  useCameraFormat,
  useCodeScanner,
} from 'react-native-vision-camera';

interface Props {
  navigation: NavigationHandler<NavigationProductProps>;
}

type torchMode = 'off' | 'on';
const CAMERA_DEVICE_TIMEOUT_MS = 500;

const BarcodeScanner: React.FC<Props> = ({ navigation }) => {
  const productHasBeenScannedRef = useRef(false);
  const cameraDevice = useCameraDevice('back');
  const cameraFormat = useCameraFormat(cameraDevice, [{ fps: 30 }]);
  const fps = cameraFormat?.maxFps ?? 30;

  const { t } = useTranslation();
  const { width, fontScale } = useWindowDimensions();

  const isFocused = useIsFocused();
  const [torchMode, setTorchMode] = useState<torchMode>('off');

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

  const onBarcodeRead = useCodeScanner({
    codeTypes: ['ean-13'],
    onCodeScanned: (codes: Code[]) => {
      if (!productHasBeenScannedRef.current && codes?.length > 0) {
        // We only want the first one
        const code = codes[0];
        if (code?.value) {
          productHasBeenScannedRef.current = true;
          setTorchMode('off');
          navigation.navigate('ProductScreen', {
            eanCode: code.value,
            isRelated: false,
            originProductEanCode: null,
          });
        }
      }
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
          fps={fps}
          format={cameraFormat}
          device={cameraDevice}
          isActive={true}
          audio={false}
          torch={torchMode}
          style={styles.preview}
          codeScanner={onBarcodeRead}
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
