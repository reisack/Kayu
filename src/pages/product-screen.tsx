import React, {useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
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
      text: t<string>('home'),
      icon: require('../../assets/images/home.png'),
      name: 'homeButton',
      position: 1,
    },
    {
      text: t<string>('scanAnotherBarcode'),
      icon: require('../../assets/images/barcode.png'),
      name: 'barcodeButton',
      position: 2,
    },
  ];

  const actionsRelatedProduct = [
    {
      text: t<string>('backToScannedProduct'),
      icon: require('../../assets/images/barcode.png'),
      name: 'backButton',
      position: 1,
    },
  ];

  const onFabPressItem = (name: string | undefined) => {
    switch (name) {
      case 'homeButton':
        navigation.navigate('Home');
        break;
      case 'barcodeButton':
        navigation.navigate('BarcodeScanner');
        break;
      case 'backButton':
        navigation.goBack();
        break;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          {productCouldBeFound ? (
            <ProductDetails
              eanCode={eanCode}
              isRelated={isRelated}
              onNotFoundProduct={() => setProductCouldBeFound(false)}
            />
          ) : (
            <NotFoundProduct />
          )}
        </View>
      </ScrollView>
      <View>
        <FloatingAction
          actions={originProductEanCode ? actionsRelatedProduct : actions}
          onPressItem={name => {
            onFabPressItem(name);
          }}
        />
      </View>
    </View>
  );
};

export default ProductScreen;
