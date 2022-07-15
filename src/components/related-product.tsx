import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Text, StyleSheet, Image, Pressable, View} from 'react-native';
import Product from '../classes/product';

interface Props {
  product: Product;
  originProductEanCode: string;
}

const RelatedProduct: React.FC<Props> = ({product, originProductEanCode}) => {
  const navigation: any = useNavigation();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#DEDEDE',
      alignItems: 'center',
      borderColor: '#1C7DB7',
      borderStyle: 'dashed',
      borderWidth: 1,
      marginVertical: 8,
      marginHorizontal: 16,
      paddingVertical: 16,
    },
    productImage: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
      backgroundColor: '#FFFFFF',
    },
    productTextContainer: {
      width: 250,
      marginTop: 8,
    },
    productText: {
      textAlign: 'left',
      fontSize: 16,
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
        <Image style={styles.productImage} source={{uri: product.imageUrl}} />
        <View style={styles.productTextContainer}>
          <Text style={styles.productText}>{product.frName}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default RelatedProduct;
