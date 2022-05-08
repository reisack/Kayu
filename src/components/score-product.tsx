import React from 'react';
import {View, Text, Button, Alert, StyleSheet} from 'react-native';
import { useTranslation } from "react-i18next";
import { ProductInformationEnum } from '../enums';
import { ScoreProductService } from '../services/module';
// @ts-ignore
import ProgressBar from 'react-native-progress/Bar';

interface Props {
  score: number,
  nutritionValue: number | string[],
  productInfo: ProductInformationEnum
}

const ScoreProduct: React.FC<Props> = ({score, nutritionValue, productInfo: productInfo}) => {
  const { t } = useTranslation();
  const scoreProductService = new ScoreProductService();

  const progressBarWidth = 200;
  const progressBarHeight = 20;

  const styles = StyleSheet.create({
    container: {
      padding: 8,
      paddingHorizontal: 24,
      marginHorizontal: 24,
      backgroundColor: score >= 50 ? '#14c258' : '#c72400',
      marginTop: 8,
    },
    section: {
      marginTop: 8,
    },
    helpButton: {
      width: 32,
      height: 32,
    },
  });

  const getScoreForProgressBar = () => {
    return score / 100.0;
  };

  const getNutritionValueForI18n = () => {
    return Array.isArray(nutritionValue)
      ? nutritionValue.length
      : nutritionValue;
  };

  return (
    <View>
      {score === null ? (
        <View />
      ) : (
        <View style={styles.container}>
          <View style={styles.section}>
            <Text>
              <View>
                <ProgressBar
                  progress={getScoreForProgressBar()}
                  width={progressBarWidth}
                  height={progressBarHeight}
                />
              </View>
              <View style={styles.helpButton}>
                <Button
                  title="?"
                  onPress={() =>
                    Alert.alert(
                      t<string>('informations'),
                      t<string>(scoreProductService.getHelpMessage(productInfo), {
                        nutritionValue: getNutritionValueForI18n(),
                      }),
                    )
                  }
                />
              </View>
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              {t<string>(scoreProductService.getExpression(score, productInfo))}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ScoreProduct;
