import React from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import {useTranslation} from 'react-i18next';

interface Props {
  navigation: any;
}

const Home: React.FC<Props> = ({navigation}) => {
  const {t} = useTranslation();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 16,
      alignItems: 'center',
    },
    buttonBarcode: {
      backgroundColor: '#1C7DB7',
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#303838',
      shadowOffset: {width: 0, height: 5},
      shadowRadius: 10,
      shadowOpacity: 0.35,
    },
    // https://www.flaticon.com/fr/icone-gratuite/code-barres_372665
    imageBarcode: {
      width: 200,
      height: 200,
      resizeMode: 'center',
    },
    textImageBarcode: {
      textAlign: 'center',
      color: '#FFFFFF',
      fontSize: 16,
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
