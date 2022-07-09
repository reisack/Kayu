import React, {useState} from 'react';
import {View, Button, ScrollView, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import ProductDetail from '../components/product-detail';
import NotFoundProduct from '../components/not-found-product';

interface Props {
  route: any;
  navigation: any;
}

const ProductScreen: React.FC<Props> = ({route, navigation}) => {
  const {t} = useTranslation();

  const styles = StyleSheet.create({
    buttonContainer: {
      paddingHorizontal: 24,
      paddingTop: 32,
    },
  });

  const {eanCode, isRelated, originProductEanCode} = route.params;

  const [productCouldBeFound, setProductCouldBeFound] = useState(true);

  const redirectToScannedProduct = () => {
    navigation.goBack();
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      {productCouldBeFound ? (
        <ProductDetail
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
    </ScrollView>
  );
};

export default ProductScreen;
