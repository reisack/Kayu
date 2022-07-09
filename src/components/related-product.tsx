import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import Product from '../classes/product';

interface Props {
  product: Product;
  originProductEanCode: string;
}

const RelatedProduct: React.FC<Props> = ({product, originProductEanCode}) => {
  const navigation: any = useNavigation();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 8,
      paddingHorizontal: 8,
      marginHorizontal: 8,
      marginTop: 8,
    },
    row: {
      flexDirection: 'row',
    },
    section: {
      marginTop: 8,
    },
    productImage: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
    },
  });

  const onRelatedProductPress = () => {
    // Use of push method instead of navigate.
    // The purpose is to keep related products data in memory when we go to a related product detail
    // and not reload them when we go back to the scanned product screen.
    // So we stack a another ProductScreen in the route.
    // More information : https://reactnavigation.org/docs/navigating/#navigate-to-a-route-multiple-times
    navigation.push('ProductScreen', {
      eanCode: product.eanCode,
      isRelated: true,
      originProductEanCode: originProductEanCode,
    });
  };

  return (
    <Pressable onPress={() => onRelatedProductPress()}>
      <View style={styles.container}>
        <View style={styles.row}>
          <Image style={styles.productImage} source={{uri: product.imageUrl}} />
          <Text>
            {product.frName} - {product.brands}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default RelatedProduct;
