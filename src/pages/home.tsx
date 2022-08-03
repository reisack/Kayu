import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  useWindowDimensions,
  Linking,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Consts from '../consts';

interface Props {
  navigation: any;
}

const Home: React.FC<Props> = ({navigation}) => {
  const {t} = useTranslation();
  const {width, fontScale} = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonBarcode: {
      backgroundColor: Consts.style.primaryColor,
      borderRadius: width * Consts.style.scaleFactor.oneSixteenth,
      paddingHorizontal: width * Consts.style.scaleFactor.oneSixteenth,
      marginBottom: width * Consts.style.scaleFactor.oneSixteenth,
    },
    // https://www.flaticon.com/fr/icone-gratuite/code-barres_372665
    imageBarcode: {
      width: width * Consts.style.scaleFactor.half,
      height: width * Consts.style.scaleFactor.half,
      resizeMode: 'center',
    },
    textImageBarcode: {
      textAlign: 'center',
      color: '#FFFFFF',
      fontSize: 16 * fontScale,
      paddingBottom: width * Consts.style.scaleFactor.oneSixteenth,
    },
    textImageBarcodeContainer: {
      width: width * Consts.style.scaleFactor.half,
    },
    privacyContainer: {
      position: 'absolute',
      bottom: 0,
      marginBottom: width * Consts.style.scaleFactor.oneThirtySecond,
    },
    privacyText: {
      textDecorationLine: 'underline',
      fontSize: 14 * fontScale,
    },
  });

  const displayPrivacy = () => {
    const privacyUrl = 'https://reisack.github.io/Kayu/privacy.html';
    Linking.canOpenURL(privacyUrl).then(canOpen => {
      if (canOpen) {
        Linking.openURL(privacyUrl);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonBarcode}>
        <Pressable onPress={() => navigation.navigate('BarcodeScanner')}>
          <Image
            style={styles.imageBarcode}
            source={require('../../assets/images/barcode.png')}
          />
          <View style={styles.textImageBarcodeContainer}>
            <Text style={styles.textImageBarcode}>
              {t<string>('scanBarcode')}
            </Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.privacyContainer}>
        <Pressable onPress={displayPrivacy}>
          <Text style={styles.privacyText}>{t<string>('privacy')}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Home;
