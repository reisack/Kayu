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

  const progressBarWidth = width * 0.75;
  const progressBarHeight = width * 0.0625;

  // One second before assign score so we have a cool animation
  const [isIndeterminate, setIndeterminate] = useState(true);
  setInterval(() => setIndeterminate(false), 1000);

  const styles = StyleSheet.create({
    container: {
      paddingVertical: width * 0.03125,
      paddingHorizontal: width * 0.09375,
      marginHorizontal: width * 0.09375,
      marginTop: width * 0.03125,
      alignSelf: 'center',
    },
    productName: {
      color: '#FFFFFF',
    },
    scoreText: {
      alignSelf: 'center',
      color: '#FFFFFF',
      marginRight: width * 0.0625,
      fontWeight: 'bold',
    },
    // https://www.flaticon.com/free-icon/information_906794
    helpImage: {
      width: width * 0.09375,
      height: width * 0.09375,
      marginLeft: width * 0.03125,
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
      return isUnfilledColor ? '#d1e5f0' : Consts.primaryColor;
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
              {t<string>(productScoreService.getNutritionLabel(productInfo))}
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
                      t<string>('informations'),
                      t<string>(
                        productScoreService.getHelpMessage(productInfo),
                        {
                          nutritionValue: getNutritionValueForI18n(),
                        },
                      ),
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
              {t<string>(productScoreService.getExpression(score, productInfo))}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ProductScore;
