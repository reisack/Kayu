import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Image, ActivityIndicator, StyleSheet} from 'react-native';
import ScoreCalculationService from '../services/score-calculation-service';
import consts from '../consts';
import NutritionValues from '../classes/nutrition-values';
import Product from '../classes/product';
import RelatedProductList from './related-product-list';
import ProductScoreList from './product-score-list';

interface Props {
  eanCode: string;
  isRelated: boolean;
  onNotFoundProduct: () => void;
}

const ProductDetails: React.FC<Props> = ({
  eanCode,
  isRelated,
  onNotFoundProduct,
}) => {
  const [isLoading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product>(Product.empty);

  const scoreCalculationService = new ScoreCalculationService();
  const isMounted = useRef(true);

  const styles = StyleSheet.create({
    productHeader: {
      alignItems: 'center',
      backgroundColor: '#1C7DB7',
    },
    productImage: {
      width: 200,
      height: 200,
      resizeMode: 'contain',
      backgroundColor: '#FFFFFF',
      marginTop: 16,
    },
    productTextContainer: {
      width: 250,
      paddingVertical: 16,
    },
    productText: {
      textAlign: 'left',
      fontSize: 16,
      color: '#FFFFFF',
    },
  });

  const getProductByEanCode = async (eanCode: string): Promise<void> => {
    try {
      const productDetailsUrl = `${consts.openFoodFactAPIBaseUrl}api/v0/product/`;
      const paramFields =
        'product_name_fr,brands,saturated-fat_100g,sugars_100g,salt_100g,additives_tags,nova_group,ecoscore_score,image_front_url,compared_to_category,categories_hierarchy';

      const response: any = await fetch(
        `${productDetailsUrl}${eanCode}.json?fields=${paramFields}`,
        consts.httpHeaderGetRequest,
      );

      const json: any = await response.json();
      if (isMounted.current) {
        if (json && json.status && json.status === 1) {
          setProduct(getSimplifiedProduct(json));
          setLoading(false);
        } else {
          onNotFoundProduct();
        }
      }
    } catch (error) {
      console.error(error);
      if (isMounted.current) {
        onNotFoundProduct();
      }
    }
  };

  const getSimplifiedProduct = (jsonFromAPI: {product: any}): Product => {
    const product = jsonFromAPI.product;

    const nutritionValues: NutritionValues = {
      fat: product['saturated-fat_100g'],
      sugar: product.sugars_100g,
      salt: product.salt_100g,
      additives: product.additives_tags,
      novaGroup: product.nova_group,
      eco: product.ecoscore_score,
    };

    const simplifiedProduct: Product = {
      eanCode: eanCode,
      frName: product.product_name_fr,
      brands: product.brands,
      imageUrl: product.image_front_url,
      mainCategory: product.compared_to_category,
      categories: product.categories_hierarchy ?? [],
      nutritionValues: nutritionValues,
      score: scoreCalculationService.getScore(nutritionValues),
    };

    return simplifiedProduct;
  };

  useEffect(() => {
    isMounted.current && getProductByEanCode(eanCode);
  }, [eanCode]);

  // Cleanup
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
          <View style={styles.productHeader}>
            <Image
              style={styles.productImage}
              source={{uri: product.imageUrl}}
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
            <View></View>
          )}
        </View>
      )}
    </View>
  );
};

export default ProductDetails;
