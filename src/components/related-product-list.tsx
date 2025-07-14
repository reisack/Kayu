import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  useWindowDimensions,
} from 'react-native';
import Product from '@/classes/product';
import Consts from '@/consts';
import RelatedProductsService from '@/services/related-products-service';
import RelatedProduct from '@/components/related-product';

interface Props {
  product: Product;
}

const RelatedProductList: React.FC<Props> = ({ product }) => {
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const { t } = useTranslation();
  const { width, fontScale } = useWindowDimensions();

  const isMounted = useRef(true);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: Consts.style.secondaryBackgroundColor,
      paddingVertical: width * Consts.style.scaleFactor.oneSixteenth,
      paddingBottom: width * Consts.style.scaleFactor.oneEighth,
    },
    scoresTitleText: {
      paddingBottom: width * Consts.style.scaleFactor.oneThirtySecond,
      fontSize: 32 * fontScale,
      fontWeight: 'bold',
      alignSelf: 'center',
      color: Consts.style.secondaryColor,
    },
  });

  const getRelatedproducts = useCallback(
    async (category: string, productTotalScore: number): Promise<void> => {
      const relatedProductsService = new RelatedProductsService();

      const relatedProductsResult =
        await relatedProductsService.getRelatedproducts(
          category,
          productTotalScore,
        );
      if (isMounted.current) {
        setRelatedProducts(relatedProductsResult);
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    isMounted.current &&
      getRelatedproducts(product.category.mainCategory, product.score.getTotal());
  }, [product, getRelatedproducts]);

  // Cleanup
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.scoresTitleText}>{t('RelatedProductsTitle')}</Text>
      {loading ? (
        <ActivityIndicator
          testID="related-products-loader"
          size="small"
          color={Consts.style.primaryColor}
        />
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
