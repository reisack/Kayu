import React, {useEffect, useState} from 'react';
import {View, Text, Image, ActivityIndicator, StyleSheet} from 'react-native';
import ScoreCalculationService from '../services/score-calculation-service'; '../services/score-calculation-service';
import ScoreProduct from './score-product';
import {ProductInformationEnum} from '../enums';
import consts from '../consts';
import NutritionValues from '../classes/nutrition-values';
import Product from '../classes/product';

interface Props {
  eanCode: string,
  onNotFoundProduct: () => void
}

const ScannedProduct: React.FC<Props> = ({eanCode, onNotFoundProduct}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Product>(Product.empty);

  const scoreCalculationService = new ScoreCalculationService();

  const styles = StyleSheet.create({
    productImage: {
      width: 200,
      height: 200,
      resizeMode: 'contain',
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
      if (json && json.status && json.status === 1) {
        setData(getSimplifiedProduct(json));
        setLoading(false);
      } else {
        onNotFoundProduct();
      }
    } catch (error) {
      console.error(error);
      onNotFoundProduct();
    }
  };

  const getSimplifiedProduct = (jsonFromAPI: { product: any; }): Product => {
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

  const canDisplayScore = (nutritionValue: any, score: any): boolean => {
    return nutritionValue !== undefined && nutritionValue !== null
        && score !== undefined && score != null;
  };

  useEffect(() => {
    getProductByEanCode(eanCode);
  }, [eanCode]);

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <Image style={styles.productImage} source={{uri: data.imageUrl}} />
          <Text>
            {data.frName} - {data.brands}
          </Text>
          <Text>Catégorie principale : {data.mainCategory}</Text>
          <Text>Catégories : {data.categories.join(' | ')}</Text>

          { canDisplayScore(data.nutritionValues.fat, data.score.fat) ? (
            <ScoreProduct
              score={data.score.fat as number}
              nutritionValue={data.nutritionValues.fat as number}
              productInfo={ProductInformationEnum.fat}
            />
          ) : (
            <View></View>
          )}

          { canDisplayScore(data.nutritionValues.salt, data.score.salt) ? (
            <ScoreProduct
              score={data.score.salt as number}
              nutritionValue={data.nutritionValues.salt as number}
              productInfo={ProductInformationEnum.salt}
            />
          ) : (
            <View></View>
          )}
          
          { canDisplayScore(data.nutritionValues.sugar, data.score.sugar) ? (
            <ScoreProduct
              score={data.score.sugar as number}
              nutritionValue={data.nutritionValues.sugar as number}
              productInfo={ProductInformationEnum.sugar}
            />
          ) : (
            <View></View>
          )}

          { canDisplayScore(data.nutritionValues.novaGroup, data.score.novaGroup) ? (
            <ScoreProduct
              score={data.score.novaGroup as number}
              nutritionValue={data.nutritionValues.novaGroup as number}
              productInfo={ProductInformationEnum.novaGroup}
            />
          ) : (
            <View></View>
          )}

          { canDisplayScore(data.nutritionValues.eco, data.score.eco) ? (
            <ScoreProduct
              score={data.score.eco as number}
              nutritionValue={data.nutritionValues.eco as number}
              productInfo={ProductInformationEnum.eco}
            />
          ) : (
            <View></View>
          )}

          { canDisplayScore(data.nutritionValues.additives, data.score.additives) ? (
            <ScoreProduct
              score={data.score.additives as number}
              nutritionValue={data.nutritionValues.additives as string[]}
              productInfo={ProductInformationEnum.additives}
            />
          ) : (
            <View></View>
          )}
        </>
      )}
    </View>
  );
};

export default ScannedProduct;
