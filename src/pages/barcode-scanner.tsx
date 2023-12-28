import React, {useEffect, useState} from 'react';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  useWindowDimensions,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Consts from '../consts';
import {NavigationHandler, NavigationProductProps} from '../shared-types';

interface Props {
  navigation: NavigationHandler<NavigationProductProps>;
}

const BarcodeScanner: React.FC<Props> = ({navigation}) => {
  const {t} = useTranslation();
  const {width, fontScale} = useWindowDimensions();

  const isFocused = useIsFocused();
  const [productHasBeenScanned, setProductHasBeenScanned] =
    useState<boolean>(false);
  const [torchMode, setTorchMode] = useState(RNCamera.Constants.FlashMode.off);

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

  const onBarcodeRead = (scanResult: {data: string}) => {
    if (!productHasBeenScanned && scanResult && scanResult.data) {
      setProductHasBeenScanned(true);
      navigation.navigate('ProductScreen', {
        eanCode: scanResult.data,
        isRelated: false,
        originProductEanCode: null,
      });
    }
  };

  const toggleTorch = () => {
    if (torchMode === RNCamera.Constants.FlashMode.off) {
      // https://www.flaticon.com/premium-icon/torch_3287897
      setTorchMode(RNCamera.Constants.FlashMode.torch);
    } else {
      // https://www.flaticon.com/premium-icon/torch_3287903
      setTorchMode(RNCamera.Constants.FlashMode.off);
    }
  };

  useEffect(() => {
    setProductHasBeenScanned(false);
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <RNCamera
        captureAudio={false}
        flashMode={torchMode}
        type={RNCamera.Constants.Type.back}
        style={styles.preview}
        onBarCodeRead={onBarcodeRead.bind(this)}>
        <BarcodeMask showAnimatedLine={false} width={300} height={300} />
      </RNCamera>
      <View style={[styles.overlay, styles.topOverlay]}>
        <Text style={styles.scanScreenMessage}>
          {t<string>('scanBarcodePlease')}
        </Text>
      </View>
      <View style={[styles.overlay, styles.bottomOverlay]}>
        {torchMode === RNCamera.Constants.FlashMode.torch ? (
          <Text style={styles.scanScreenMessage}>
            {t<string>('scanBarcodeLightOn')}
          </Text>
        ) : (
          <View />
        )}

        <View style={styles.torchButton}>
          <Pressable onPress={() => toggleTorch()}>
            {torchMode === RNCamera.Constants.FlashMode.off ? (
              <Image
                style={styles.iconButton}
                source={require('../../assets/images/torch_on.png')}
              />
            ) : (
              <Image
                style={styles.iconButton}
                source={require('../../assets/images/torch_off.png')}
              />
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default BarcodeScanner;
