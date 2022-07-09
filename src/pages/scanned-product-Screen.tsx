import React, {useState} from 'react';
import {View, Button, ScrollView, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import ScannedProduct from '../components/scanned-product';
import NotFoundProduct from '../components/not-found-product';

interface Props {
  route: any;
  navigation: any;
}

const ScannedProductScreen: React.FC<Props> = ({route, navigation}) => {
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
    // navigation.navigate('ScannedProductScreen', {
    //   eanCode: originProductEanCode,
    //   isRelated: false,
    //   originProductEanCode: null,
    // });
    navigation.goBack();
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      {productCouldBeFound ? (
        <ScannedProduct
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
        <View></View>
      )}

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
    </ScrollView>
  );
};

export default ScannedProductScreen;
