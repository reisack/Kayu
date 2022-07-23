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
      backgroundColor: Consts.primaryColor,
      borderRadius: width * 0.0625,
      paddingHorizontal: width * 0.0625,
      marginBottom: width * 0.0625,
      shadowColor: '#303838',
      shadowOffset: {width: 0, height: 5},
      shadowRadius: 10,
      shadowOpacity: 0.35,
    },
    // https://www.flaticon.com/fr/icone-gratuite/code-barres_372665
    imageBarcode: {
      width: width * 0.5,
      height: width * 0.5,
      resizeMode: 'center',
    },
    textImageBarcode: {
      textAlign: 'center',
      color: '#FFFFFF',
      fontSize: 16 * fontScale,
      paddingBottom: width * 0.0625,
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
