import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, useWindowDimensions} from 'react-native';
import {useTranslation} from 'react-i18next';
import ProductDetails from '../components/product-details';
import NotFoundProduct from '../components/not-found-product';
import {FloatingAction, IActionProps} from 'react-native-floating-action';
import Consts from '../consts';
import {
  DefaultNavigationHandler,
  NavigationProductProps,
} from '../shared-types';
import {ParamListBase, RouteProp} from '@react-navigation/native';

interface Props {
  route: RouteProp<ParamListBase, 'ProductScreen'>;
  navigation: DefaultNavigationHandler;
}

const ProductScreen: React.FC<Props> = ({route, navigation}) => {
  const {t} = useTranslation();
  const {width} = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Consts.style.primaryBackgroundColor,
    },
    buttonContainer: {
      paddingTop: width * Consts.style.scaleFactor.quarter,
    },
  });

  const {eanCode, isRelated, originProductEanCode} =
    route.params as NavigationProductProps;

  const [productCouldBeFound, setProductCouldBeFound] = useState(true);

  // https://www.flaticon.com/fr/icone-gratuite/accueil_25694
  const actions: IActionProps[] = [
    {
      text: t('home'),
      icon: require('../../assets/images/home.png'),
      color: Consts.style.primaryColor,
      name: 'homeButton',
    },
    {
      text: t('scanAnotherBarcode'),
      icon: require('../../assets/images/barcode.png'),
      color: Consts.style.primaryColor,
      name: 'barcodeButton',
    },
  ];

  const actionsRelatedProduct: IActionProps[] = [
    {
      text: t('backToScannedProduct'),
      icon: require('../../assets/images/barcode.png'),
      color: Consts.style.primaryColor,
      name: 'backButton',
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
          color={Consts.style.primaryColor}
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
