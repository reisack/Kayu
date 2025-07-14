import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import ProductScore from '@/components/product-score';
import {ProductInformationEnum} from '../enums';
import Product from '@/classes/product';
import {useTranslation} from 'react-i18next';
import Consts from '@/consts';
import {Nullable} from '@/extensions';

interface Props {
  product: Product;
}

const ProductScoreList: React.FC<Props> = ({product}) => {
  const {t} = useTranslation();
  const {width, fontScale} = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: Consts.style.tertiaryBackgroundColor,
      paddingVertical: width * Consts.style.scaleFactor.oneSixteenth,
      paddingBottom: width * Consts.style.scaleFactor.oneEighth,
    },
    scoresTitle: {
      alignSelf: 'center',
      marginRight: width * Consts.style.scaleFactor.oneSixteenth,
    },
    scoresTitleText: {
      color: Consts.style.primaryFontColor,
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
        <Text style={styles.scoresTitleText}>{t('ScoreTitle')}</Text>
      </View>
      {canDisplayScore(product.nutritionValues.fat, product.score.fat) ? (
        <View>
          <ProductScore
            score={product.score.fat ?? null}
            nutritionValue={product.nutritionValues.fat ?? 0}
            productInfo={ProductInformationEnum.fat}
          />
        </View>
      ) : (
        <View />
      )}

      {canDisplayScore(product.nutritionValues.salt, product.score.salt) ? (
        <ProductScore
          score={product.score.salt ?? null}
          nutritionValue={product.nutritionValues.salt ?? 0}
          productInfo={ProductInformationEnum.salt}
        />
      ) : (
        <View />
      )}

      {canDisplayScore(product.nutritionValues.sugar, product.score.sugar) ? (
        <ProductScore
          score={product.score.sugar ?? null}
          nutritionValue={product.nutritionValues.sugar ?? 0}
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
          score={product.score.novaGroup ?? null}
          nutritionValue={product.nutritionValues.novaGroup ?? 0}
          productInfo={ProductInformationEnum.novaGroup}
        />
      ) : (
        <View />
      )}

      {canDisplayScore(product.nutritionValues.eco, product.score.eco) ? (
        <ProductScore
          score={product.score.eco ?? null}
          nutritionValue={product.nutritionValues.eco ?? 0}
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
          score={product.score.additives ?? null}
          nutritionValue={product.nutritionValues.additives ?? []}
          productInfo={ProductInformationEnum.additives}
        />
      ) : (
        <View />
      )}
    </View>
  );
};

export default ProductScoreList;
