import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Text,
  StyleSheet,
  Image,
  Pressable,
  View,
  useWindowDimensions,
} from 'react-native';
import Product from '@/classes/product';
import Consts from '@/consts';
import {NavigationHandler, NavigationProductProps} from '@/shared-types';

interface Props {
  product: Product;
  originProductEanCode: string;
}

const RelatedProduct: React.FC<Props> = ({product, originProductEanCode}) => {
  const navigation = useNavigation<NavigationHandler<NavigationProductProps>>();
  const {width, fontScale} = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: Consts.style.primaryBackgroundColor,
      alignItems: 'center',
      borderColor: Consts.style.primaryColor,
      borderStyle: 'dashed',
      borderWidth: 1,
      marginVertical: width * Consts.style.scaleFactor.oneThirtySecond,
      marginHorizontal: width * Consts.style.scaleFactor.oneSixteenth,
      paddingVertical: width * Consts.style.scaleFactor.oneSixteenth,
    },
    productImage: {
      width: width * Consts.style.scaleFactor.quarter,
      height: width * Consts.style.scaleFactor.quarter,
      resizeMode: 'contain',
    },
    productTextContainer: {
      width: width * Consts.style.scaleFactor.threeQuarter,
      marginTop: width * Consts.style.scaleFactor.oneThirtySecond,
    },
    productText: {
      textAlign: 'left',
      fontSize: 16 * fontScale,
      color: Consts.style.secondaryColor,
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
