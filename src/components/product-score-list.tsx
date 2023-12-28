import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import ProductScore from './product-score';
import {ProductInformationEnum} from '../enums';
import Product from '../classes/product';
import {useTranslation} from 'react-i18next';
import Consts from '../consts';
import {Nullable} from '../extensions';

interface Props {
  product: Product;
}

const ProductScoreList: React.FC<Props> = ({product}) => {
  const {t} = useTranslation();
  const {width, fontScale} = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#803c13',
      paddingVertical: width * Consts.style.scaleFactor.oneSixteenth,
    },
    scoresTitle: {
      alignSelf: 'center',
      marginRight: width * Consts.style.scaleFactor.oneSixteenth,
    },
    scoresTitleText: {
      color: '#FFFFFF',
      fontSize: 32 * fontScale,
      fontWeight: 'bold',
    },
  });

  const canDisplayScore = (
    nutritionValue: Nullable<number> | Nullable<string[]>,
    score: Nullable<number>,
  ): boolean => {
    return (
      nutritionValue !== undefined &&
      nutritionValue !== null &&
      score !== undefined &&
      score != null
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoresTitle}>
        <Text style={styles.scoresTitleText}>{t<string>('ScoreTitle')}</Text>
      </View>
      {canDisplayScore(product.nutritionValues.fat, product.score.fat) ? (
        <View>
          <ProductScore
            score={product.score.fat as number}
            nutritionValue={product.nutritionValues.fat as number}
            productInfo={ProductInformationEnum.fat}
          />
        </View>
      ) : (
        <View />
      )}

      {canDisplayScore(product.nutritionValues.salt, product.score.salt) ? (
        <ProductScore
          score={product.score.salt as number}
          nutritionValue={product.nutritionValues.salt as number}
          productInfo={ProductInformationEnum.salt}
        />
      ) : (
        <View />
      )}

      {canDisplayScore(product.nutritionValues.sugar, product.score.sugar) ? (
        <ProductScore
          score={product.score.sugar as number}
          nutritionValue={product.nutritionValues.sugar as number}
          productInfo={ProductInformationEnum.sugar}
        />
      ) : (
        <View />
      )}

      {canDisplayScore(
        product.nutritionValues.novaGroup,
        product.score.novaGroup,
      ) ? (
        <ProductScore
          score={product.score.novaGroup as number}
          nutritionValue={product.nutritionValues.novaGroup as number}
          productInfo={ProductInformationEnum.novaGroup}
        />
      ) : (
        <View />
      )}

      {canDisplayScore(product.nutritionValues.eco, product.score.eco) ? (
        <ProductScore
          score={product.score.eco as number}
          nutritionValue={product.nutritionValues.eco as number}
          productInfo={ProductInformationEnum.eco}
        />
      ) : (
        <View />
      )}

      {canDisplayScore(
        product.nutritionValues.additives,
        product.score.additives,
      ) ? (
        <ProductScore
          score={product.score.additives as number}
          nutritionValue={product.nutritionValues.additives as string[]}
          productInfo={ProductInformationEnum.additives}
        />
      ) : (
        <View />
      )}
    </View>
  );
};

export default ProductScoreList;
