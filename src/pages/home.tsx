import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  useWindowDimensions,
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
      shadowColor: '#303838',
      shadowOffset: {width: 0, height: 5},
      shadowRadius: 10,
      shadowOpacity: 0.35,
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
  });

  return (
    <View style={styles.container}>
      <View style={styles.buttonBarcode}>
        <Pressable onPress={() => navigation.navigate('BarcodeScanner')}>
          <Image
            style={styles.imageBarcode}
            source={require('../../assets/images/barcode.png')}
          />
          <Text style={styles.textImageBarcode}>
            {t<string>('scanBarcode')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Home;
