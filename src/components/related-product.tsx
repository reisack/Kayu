import React from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import Product from '../classes/product';

interface Props {
  product: Product;
  navigation: any;
}

const RelatedProduct: React.FC<Props> = ({product, navigation}) => {
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
    navigation.navigate('ScannedProductScreen', {
      eanCode: product.eanCode,
      isRelated: true,
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
