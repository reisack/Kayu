import productInformationEnum from '../enums/product-information';
import {getAdditiveScoreInformations} from '../services/additive-informations-service';

const getScoresFromProduct = nutritionValues => {
  return {
    fat: getScore(nutritionValues, productInformationEnum.fat),
    sugar: getScore(nutritionValues, productInformationEnum.sugar),
    salt: getScore(nutritionValues, productInformationEnum.salt),
    novaGroup: getScore(nutritionValues, productInformationEnum.novaGroup),
    eco: getScore(nutritionValues, productInformationEnum.eco),
    additives: getScore(nutritionValues, productInformationEnum.additives),
  };

  function getScore(nutritionValues, productInformation) {
    const productInformationValue = getNutritionValue(
      nutritionValues,
      productInformation,
    );
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

  function getNutritionValue(nutritionValues, productInformation) {
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
};

export default getScoresFromProduct;
