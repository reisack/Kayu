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
        const productInformationValue = getProductInformation(nutritionValues, productInformation);
        let score = null;
        if (productInformationValue !== null) {
            score = calculateScore(productInformationValue, productInformation);
            score = limitTo100(score);
        }

        return score;
    }

    function getProductInformation(nutritionValues, productInformation) {
        let information;

        switch (productInformation) {
            case productInformationEnum.fat :
                information = nutritionValues.fat;
            break;
            case productInformationEnum.sugar :
                information = nutritionValues.sugar;
            break;
            case productInformationEnum.salt :
                information = nutritionValues.salt;
            break;
            case productInformationEnum.additives :
                information = nutritionValues.additives;
            break;
            case productInformationEnum.novaGroup :
                information = nutritionValues.novaGroup;
            break;
            case productInformationEnum.eco :
                information = nutritionValues.eco;
            break;
        }

        return information;
    }

    function calculateScore(productInformationValue, productInformation) {
        switch (productInformation) {
            case productInformationEnum.fat :
                productInformationValue *= 10;
            break;
            case productInformationEnum.sugar :
                productInformationValue *= 2.22;
            break;
            case productInformationEnum.salt :
                productInformationValue *= 40;
            break;
            case productInformationEnum.additives :
                productInformationValue = getAdditivesScore(productInformationValue);
            break;
            case productInformationEnum.eco :
                productInformationValue = 100 - productInformationValue;
            break;
            case productInformationEnum.novaGroup :
                productInformationValue *= 25;
            break;
        }
        return productInformationValue;
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