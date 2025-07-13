import React, {useState} from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Pressable,
  Image,
  useWindowDimensions,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import ProductScoreService from '../services/product-score-service';
import {ProductInformationEnum} from '../enums';
// @ts-ignore
import ProgressBar from 'react-native-progress/Bar';
import Consts from '../consts';

interface Props {
  score: number;
  nutritionValue: number | string[];
  productInfo: ProductInformationEnum;
}

const ProductScore: React.FC<Props> = ({
  score,
  nutritionValue,
  productInfo: productInfo,
}) => {
  const {t} = useTranslation();
  const {width} = useWindowDimensions();

  const productScoreService = new ProductScoreService();

  const progressBarWidth = width * Consts.style.scaleFactor.threeQuarter;
  const progressBarHeight = width * Consts.style.scaleFactor.oneSixteenth;

  // One second before assign score so we have a cool animation
  const [isIndeterminate, setIndeterminate] = useState(true);
  setInterval(() => setIndeterminate(false), 1000);

  const styles = StyleSheet.create({
    container: {
      paddingVertical: width * Consts.style.scaleFactor.oneThirtySecond,
      paddingHorizontal: width * Consts.style.scaleFactor.oneTwelfth,
      marginHorizontal: width * Consts.style.scaleFactor.oneTwelfth,
      marginTop: width * Consts.style.scaleFactor.oneThirtySecond,
      alignSelf: 'center',
    },
    productName: {
      color: Consts.style.primaryFontColor,
    },
    scoreText: {
      alignSelf: 'center',
      color: Consts.style.primaryFontColor,
      marginRight: width * Consts.style.scaleFactor.oneSixteenth,
      fontWeight: 'bold',
    },
    // https://www.flaticon.com/free-icon/information_906794
    helpImage: {
      width: width * Consts.style.scaleFactor.oneTwelfth,
      height: width * Consts.style.scaleFactor.oneTwelfth,
      marginLeft: width * Consts.style.scaleFactor.oneThirtySecond,
    },
    row: {
      flexDirection: 'row',
    },
  });

  const getProgressBarScore = () => {
    return score / 100.0;
  };

  const getProgressBarColor = (
    highscoreColor: string,
    lowscoreColor: string,
    isUnfilledColor: boolean,
  ): string => {
    if (isIndeterminate) {
      return isUnfilledColor ? '#d1e5f0' : Consts.style.primaryColor;
    } else {
      return score >= 50 ? highscoreColor : lowscoreColor;
    }
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
          <View>
            <Text style={styles.scoreText}>
              {t(productScoreService.getNutritionLabel(productInfo))}
            </Text>
            <View style={styles.row}>
              <View>
                <ProgressBar
                  color={getProgressBarColor('#14c258', '#c72400', false)}
                  unfilledColor={getProgressBarColor(
                    '#d0f2dd',
                    '#f3d3cc',
                    true,
                  )}
                  progress={getProgressBarScore()}
                  width={progressBarWidth}
                  height={progressBarHeight}
                  indeterminate={isIndeterminate}
                  indeterminateAnimationDuration={1000}
                />
              </View>
              <View>
                <Pressable
                  onPress={() =>
                    Alert.alert(
                      t('informations'),
                      t(productScoreService.getHelpMessage(productInfo), {
                        nutritionValue: getNutritionValueForI18n(),
                      }),
                    )
                  }>
                  <Image
                    style={styles.helpImage}
                    source={require('../../assets/images/help.png')}
                  />
                </Pressable>
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.productName}>
              {t(productScoreService.getExpression(score, productInfo))}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ProductScore;
