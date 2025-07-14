import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  ToastAndroid,
} from 'react-native';
import ScoreCalculationService from '@/services/score-calculation-service';
import NutritionValues from '@/classes/nutrition-values';
import Product from '@/classes/product';
import RelatedProductList from '@/components/related-product-list';
import ProductScoreList from '@/components/product-score-list';
import Consts from '@/consts';
import { useTranslation } from 'react-i18next';
import { ProductApi } from '@/shared-types';
import { Nullable } from '@/extensions';

interface Props {
  eanCode: string;
  isRelated: boolean;
  onNotFoundProduct: () => void;
}

type ProductApiResponse = {
  product: ProductApi;
  status: Nullable<number>;
};

const ProductDetails: React.FC<Props> = ({
  eanCode,
  isRelated,
  onNotFoundProduct,
}) => {
  const { t } = useTranslation();
  const { width, height, fontScale } = useWindowDimensions();

  const [isLoading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product>(Product.empty);

  const isMounted = useRef(true);

  const styles = StyleSheet.create({
    productHeader: {
      alignItems: 'center',
      backgroundColor: Consts.style.primaryColor,
    },
    productImage: {
      width: width * Consts.style.scaleFactor.half,
      height: width * Consts.style.scaleFactor.half,
      resizeMode: 'contain',
      marginTop: width * Consts.style.scaleFactor.oneSixteenth,
    },
    productTextContainer: {
      width: width * Consts.style.scaleFactor.threeQuarter,
      paddingVertical: width * Consts.style.scaleFactor.oneSixteenth,
    },
    productText: {
      textAlign: 'left',
      fontSize: 16 * fontScale,
      color: Consts.style.primaryFontColor,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      height: height,
    },
  });

  const getSimplifiedProduct = useCallback(
    (jsonFromAPI: ProductApiResponse): Product => {
      const productFromApi = jsonFromAPI.product;

      const nutritionValues: NutritionValues = {
        fat: productFromApi['saturated-fat_100g'],
        sugar: productFromApi.sugars_100g,
        salt: productFromApi.salt_100g,
        additives: productFromApi.additives_tags,
        novaGroup: productFromApi.nova_group,
        eco: productFromApi.ecoscore_score,
      };

      const scoreCalculationService = new ScoreCalculationService();

      const simplifiedProduct: Product = {
        eanCode: eanCode,
        frName: productFromApi.product_name_fr,
        brands: productFromApi.brands,
        imageUrl: productFromApi.image_front_url,
        mainCategory: productFromApi.compared_to_category,
        categories: productFromApi.categories_hierarchy ?? [],
        nutritionValues: nutritionValues,
        score: scoreCalculationService.getScore(nutritionValues),
      };

      return simplifiedProduct;
    },
    [eanCode],
  );

  const getProductByEanCode = useCallback(async (): Promise<void> => {
    try {
      const productDetailsUrl = `${Consts.openFoodFactAPIBaseUrl}api/v0/product/`;
      const paramFields =
        'product_name_fr,brands,saturated-fat_100g,sugars_100g,salt_100g,additives_tags,nova_group,ecoscore_score,image_front_url,compared_to_category,categories_hierarchy';

      const response = await fetch(
        `${productDetailsUrl}${eanCode}.json?fields=${paramFields}`,
        Consts.httpHeaderGetRequest,
      );

      const json: ProductApiResponse = await response.json();
      if (isMounted.current) {
        if (json && json.status && json.status === 1) {
          setProduct(getSimplifiedProduct(json));
          setLoading(false);
        } else {
          onNotFoundProduct();
        }
      }
    } catch (error) {
      console.log(
        `getProductByEanCode - Cannot find product with scanned code. Error : ${error}`,
      );
      ToastAndroid.show(t('error.getProductByEanCode'), ToastAndroid.LONG);

      if (isMounted.current) {
        onNotFoundProduct();
      }
    }
  }, [getSimplifiedProduct, onNotFoundProduct, t, eanCode]);

  useEffect(() => {
    isMounted.current && getProductByEanCode();
  }, [eanCode, getProductByEanCode]);

  // Cleanup
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            testID="product-loading"
            size="large"
            color={Consts.style.primaryColor}
          />
        </View>
      ) : (
        <View>
          <View style={styles.productHeader}>
            <Image
              testID="product-image"
              style={styles.productImage}
              source={{ uri: product.imageUrl }}
            />
            <View style={styles.productTextContainer}>
              <Text style={styles.productText}>{product.frName}</Text>
            </View>
          </View>
          <ProductScoreList product={product} />
          {!isRelated ? (
            <View>
              <RelatedProductList product={product} />
            </View>
          ) : (
            <View />
          )}
        </View>
      )}
    </View>
  );
};

export default ProductDetails;
