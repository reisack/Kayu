import productInformationEnum from '../enums/product-information';

const getScoresFromProduct = (nutritionValues) => {

    return {
        fat: getScore(nutritionValues, productInformationEnum.fat),
        sugar: getScore(nutritionValues, productInformationEnum.sugar),
        salt: getScore(nutritionValues, productInformationEnum.salt),
        novaGroup: getScore(nutritionValues, productInformationEnum.novaGroup),
        eco: getScore(nutritionValues, productInformationEnum.eco),
        additives: getScore(nutritionValues, productInformationEnum.additives)
    };

    function getScore(nutritionValues, productInformation) {
        const productInformationValue = getNutritionValue(nutritionValues, productInformation);
        let score = null;
        if (productInformationValue !== null) {
            score = calculateScore(productInformationValue, productInformation);
            score = limitTo100(score);
        }

        return score;
    }

    function getNutritionValue(nutritionValues, productInformation) {
        const nutritionInformations = {
            [productInformationEnum.fat]: nutritionValues.fat,
            [productInformationEnum.sugar]: nutritionValues.sugar,
            [productInformationEnum.salt]: nutritionValues.salt,
            [productInformationEnum.additives]: nutritionValues.additives,
            [productInformationEnum.novaGroup]: nutritionValues.novaGroup,
            [productInformationEnum.eco]: nutritionValues.eco,
        };

        return nutritionInformations[productInformation];
    }

    function calculateScore(productInformationValue, productInformation) {
        const productScoresCalculations = {
            [productInformationEnum.fat]: productInformationValue * 10,
            [productInformationEnum.sugar]: productInformationValue * 2.22,
            [productInformationEnum.salt]: productInformationValue * 40,
            [productInformationEnum.additives]: getAdditivesScore(productInformationValue),
            [productInformationEnum.novaGroup]: productInformationValue * 25,
            [productInformationEnum.eco]: 100 - productInformationValue
        };

        return productScoresCalculations[productInformation];
    }

    function getAdditivesScore(productInformationValue) {
        let additivesScore = null;
        if (productInformationValue !== null) {
            additivesScore = 0;
            if (global.additiveScoreInformations) {
                for (const additive in productInformationValue) {
                    const additiveCode = productInformationValue[additive];
                    const additiveScore = global.additiveScoreInformations[additiveCode];
                    if (additiveScore) {
                        additivesScore += additiveScore;
                    }
                }
            }
        }

        return additivesScore;
    }

    function limitTo100(score) {
        if (score > 100) {
            score = 100;
        }

        return score;
    }
}

export default getScoresFromProduct;