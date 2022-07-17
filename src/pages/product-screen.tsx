import React, {useState} from 'react';
import {View, Button, ScrollView, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import ProductDetails from '../components/product-details';
import NotFoundProduct from '../components/not-found-product';
import {FloatingAction} from 'react-native-floating-action';

interface Props {
  route: any;
  navigation: any;
}

const ProductScreen: React.FC<Props> = ({route, navigation}) => {
  const {t} = useTranslation();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    buttonContainer: {
      paddingTop: 32,
    },
  });

  const {eanCode, isRelated, originProductEanCode} = route.params;

  const [productCouldBeFound, setProductCouldBeFound] = useState(true);

  // https://www.flaticon.com/fr/icone-gratuite/accueil_25694
  const actions = [
    {
      text: 'Home',
      icon: require('../../assets/images/home.png'),
      name: 'homeButton',
      position: 1,
    },
    {
      text: 'Scan',
      icon: require('../../assets/images/barcode.png'),
      name: 'barcodeButton',
      position: 2,
    },
  ];

  const redirectToScannedProduct = () => {
    navigation.goBack();
  };

  return (
    <View>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          {productCouldBeFound ? (
            <ProductDetails
              eanCode={eanCode}
              isRelated={isRelated}
              onNotFoundProduct={() => setProductCouldBeFound(false)}
            />
          ) : (
            <NotFoundProduct />
          )}

          {originProductEanCode ? (
            <View style={styles.buttonContainer}>
              <Button
                title={t<string>('backToScannedProduct')}
                onPress={() => redirectToScannedProduct()}
              />
            </View>
          ) : (
            <View>
              <View style={styles.buttonContainer}>
                <Button
                  title={t<string>('home')}
                  onPress={() => navigation.navigate('Home')}
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  title={t<string>('scanAnotherBarcode')}
                  onPress={() => navigation.navigate('BarcodeScanner')}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <FloatingAction
        actions={actions}
        onPressItem={name => {
          console.log(`selected button: ${name}`);
        }}
      />
    </View>
  );
};

export default ProductScreen;
