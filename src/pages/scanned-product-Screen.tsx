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

  const {eanCode, isRelated} = route.params;

  const [productCouldBeFound, setProductCouldBeFound] = useState(true);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      {productCouldBeFound ? (
        <ScannedProduct
          eanCode={eanCode}
          isRelated={isRelated}
          onNotFoundProduct={() => setProductCouldBeFound(false)}
          navigation={navigation}
        />
      ) : (
        <NotFoundProduct />
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
