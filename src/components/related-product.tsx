import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Product from '../classes/product';

interface Props {
  product: Product;
}

const RelatedProduct: React.FC<Props> = ({product}) => {
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

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image style={styles.productImage} source={{uri: product.imageUrl}} />
        <Text>
          {product.frName} - {product.brands}
        </Text>
      </View>
    </View>
  );
};

export default RelatedProduct;
