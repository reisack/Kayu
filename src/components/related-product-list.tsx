import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  useWindowDimensions,
} from 'react-native';
import Product from '../classes/product';
import Consts from '../consts';
import RelatedProductsService from '../services/related-products-service';
import RelatedProduct from './related-product';

interface Props {
  product: Product;
}

const RelatedProductList: React.FC<Props> = ({product}) => {
  const [isLoading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const {t} = useTranslation();
  const {width, fontScale} = useWindowDimensions();

  const relatedProductsService = new RelatedProductsService();
  const isMounted = useRef(true);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#CDCDCD',
      paddingVertical: width * Consts.style.scaleFactor.oneSixteenth,
    },
    scoresTitleText: {
      paddingBottom: width * Consts.style.scaleFactor.oneThirtySecond,
      fontSize: 32 * fontScale,
      fontWeight: 'bold',
      alignSelf: 'center',
      color: Consts.style.secondaryColor,
    },
  });

  const getRelatedproducts = async (
    category: string,
    productTotalScore: number,
  ): Promise<void> => {
    const relatedProducts = await relatedProductsService.getRelatedproducts(
      category,
      productTotalScore,
    );
    if (isMounted.current) {
      setRelatedProducts(relatedProducts);
      setLoading(false);
    }
  };

  useEffect(() => {
    isMounted.current &&
      getRelatedproducts(product.mainCategory, product.score.getTotal());
  }, [product]);

  // Cleanup
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.scoresTitleText}>
        {t<string>('RelatedProductsTitle')}
      </Text>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        relatedProducts.map((relatedProduct: Product) => {
          return (
            <RelatedProduct
              originProductEanCode={product.eanCode}
              key={relatedProduct.eanCode}
              product={relatedProduct}
            />
          );
        })
      )}
    </View>
  );
};

export default RelatedProductList;
