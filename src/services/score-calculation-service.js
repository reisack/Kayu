const getScoresFromProduct = (product) => {

    const productInformationEnum = {
        fat: 0,
        sugar: 1,
        salt: 2,
        novaGroup: 3,
        eco: 4,
        additives: 5
    };

    return {
        fat: getScore(product, productInformationEnum.fat),
        sugar: getScore(product, productInformationEnum.sugar),
        salt: getScore(product, productInformationEnum.salt),
        novaGroup: getScore(product, productInformationEnum.novaGroup),
        eco: getScore(product, productInformationEnum.eco),
        additives: getScore(product, productInformationEnum.additives)
    };

    function getScore(product, productInformation) {
        const productInformationValue = getProductInformation(product, productInformation);
        let score = null;
        if (productInformationValue !== null) {
            score = calculateScore(productInformationValue, productInformation);
            score = limitTo100(score);
        }

        return score;
    }

    function getProductInformation(product, productInformation) {
        let information;

        switch (productInformation) {
            case productInformationEnum.fat :
                information = product.nutriments["saturated-fat_100g"] ?? null;
            break;
            case productInformationEnum.sugar :
                information = product.nutriments["sugars_100g"] ?? null;
            break;
            case productInformationEnum.salt :
                information = product.nutriments["salt_100g"] ?? null;
            break;
            case productInformationEnum.additives :
                information = product.additives_tags ?? null;
            break;
            case productInformationEnum.novaGroup :
                information = product.nova_group ?? null;
            break;
            case productInformationEnum.eco :
                information = product.ecoscore_score ?? null;
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