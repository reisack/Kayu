import productInformationEnum from '../enums/product-information';
import {getAdditiveScoreInformations} from '../services/additive-informations-service';

const getScoresFromProduct = nutritionValues => {
  return {
    fat: getScore(productInformationEnum.fat),
    sugar: getScore(productInformationEnum.sugar),
    salt: getScore(productInformationEnum.salt),
    novaGroup: getScore(productInformationEnum.novaGroup),
    eco: getScore(productInformationEnum.eco),
    additives: getScore(productInformationEnum.additives),
    getTotal: function () {
      return calculateTotal(this);
    },
  };

  function getScore(productInformation) {
    const productInformationValue = getNutritionValue(productInformation);
    let score = null;
    if (
      productInformationValue !== undefined &&
      productInformationValue !== null
    ) {
      score = calculateScore(productInformationValue, productInformation);
      score = limitTo100(score);
    }

    return score;
  }

  function getNutritionValue(productInformation) {
    switch (productInformation) {
      case productInformationEnum.fat:
        return nutritionValues.fat;
      case productInformationEnum.sugar:
        return nutritionValues.sugar;
      case productInformationEnum.salt:
        return nutritionValues.salt;
      case productInformationEnum.additives:
        return nutritionValues.additives;
      case productInformationEnum.novaGroup:
        return nutritionValues.novaGroup;
      case productInformationEnum.eco:
        return nutritionValues.eco;
    }

    throw 'getScoresFromProduct.getNutritionValue() - productInformationEnum not found';
  }

  function calculateScore(productInformationValue, productInformation) {
    switch (productInformation) {
      case productInformationEnum.fat:
        return productInformationValue * 10;
      case productInformationEnum.sugar:
        return productInformationValue * 2.22;
      case productInformationEnum.salt:
        return productInformationValue * 40;
      case productInformationEnum.additives:
        return getAdditivesScore(productInformationValue);
      case productInformationEnum.novaGroup:
        return productInformationValue * 25;
      case productInformationEnum.eco:
        return 100 - productInformationValue;
    }

    throw 'getScoresFromProduct.calculateScore() - productInformationEnum not found';
  }

  function getAdditivesScore(productInformationValue) {
    let additivesScore = null;
    if (Array.isArray(productInformationValue)) {
      const additiveScoreInformations = getAdditiveScoreInformations();
      if (additiveScoreInformations) {
        additivesScore = 0;
        for (const additiveCode of productInformationValue) {
          const additiveScore = additiveScoreInformations[additiveCode];
          if (additiveScore) {
            additivesScore += additiveScore;
          }
        }
      }
    }

    return additivesScore;
  }

  function limitTo100(score) {
    return score > 100 ? 100 : score;
  }

  function calculateTotal(scoresObject) {
    let total = 0;
    total += scoresObject.fat ?? 0;
    total += scoresObject.sugar ?? 0;
    total += scoresObject.salt ?? 0;
    total += scoresObject.novaGroup ?? 0;
    total += scoresObject.eco ?? 0;
    total += scoresObject.additives ?? 0;

    return total;
  }
};

export default getScoresFromProduct;
