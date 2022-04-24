import React, {useEffect, useState} from 'react';
import {View, Text, Image, ActivityIndicator, StyleSheet} from 'react-native';
import getScoresFromProduct from '../services/score-calculation-service';
import ScoreProduct from './score-product';
import productInformationEnum from '../enums/product-information';
import consts from '../consts';

const ScannedProduct = ({eanCode, onNotFoundProduct}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState({});

  const styles = StyleSheet.create({
    productImage: {
      width: 200,
      height: 200,
      resizeMode: 'contain',
    },
  });

  const getProductByEanCode = async () => {
    try {
      const productDetailsUrl = `${consts.openFoodFactAPIBaseUrl}api/v0/product/`;
      const paramFields =
        'product_name_fr,brands,saturated-fat_100g,sugars_100g,salt_100g,additives_tags,nova_group,ecoscore_score,image_front_url,compared_to_category,categories_hierarchy';

      const response = await fetch(
        `${productDetailsUrl}${eanCode}.json?fields=${paramFields}`,
        consts.httpHeaderGetRequest,
      );
      const json = await response.json();
      if (json && json.status && json.status === 1) {
        setData(getSimplifiedObject(json));
        setLoading(false);
      } else {
        onNotFoundProduct();
      }
    } catch (error) {
      console.error(error);
      onNotFoundProduct();
    }
  };

  const getSimplifiedObject = jsonFromAPI => {
    const product = jsonFromAPI.product;

    const nutritionValues = {
      fat: product['saturated-fat_100g'],
      sugar: product.sugars_100g,
      salt: product.salt_100g,
      additives: product.additives_tags,
      novaGroup: product.nova_group,
      eco: product.ecoscore_score,
    };

    return {
      frName: product.product_name_fr,
      brands: product.brands,
      imageUrl: product.image_front_url,
      mainCategory: product.compared_to_category,
      categories: product.categories_hierarchy ?? [],
      nutritionValues: nutritionValues,
      scores: getScoresFromProduct(nutritionValues),
    };
  };

  useEffect(() => {
    getProductByEanCode(eanCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <ScoreProduct
            score={data.scores.fat}
            nutritionValue={data.nutritionValues.fat}
            productInfoEnum={productInformationEnum.fat}
          />
          <ScoreProduct
            score={data.scores.salt}
            nutritionValue={data.nutritionValues.salt}
            productInfoEnum={productInformationEnum.salt}
          />
          <ScoreProduct
            score={data.scores.sugar}
            nutritionValue={data.nutritionValues.sugar}
            productInfoEnum={productInformationEnum.sugar}
          />
          <ScoreProduct
            score={data.scores.novaGroup}
            nutritionValue={data.nutritionValues.novaGroup}
            productInfoEnum={productInformationEnum.novaGroup}
          />
          <ScoreProduct
            score={data.scores.eco}
            nutritionValue={data.nutritionValues.eco}
            productInfoEnum={productInformationEnum.eco}
          />
          <ScoreProduct
            score={data.scores.additives}
            nutritionValue={data.nutritionValues.additives}
            productInfoEnum={productInformationEnum.additives}
          />
        </>
      )}
    </View>
  );
};

export default ScannedProduct;
