const getScoresFromProduct = (product) => {

    return {
        fat: getFatScore(product),
        sugar: getSugarScore(product),
        salt: getSaltScore(product),
        novaGroup: getNovaScore(product),
        eco: getEcoScore(product),
        additives: getAdditivesScore(product)
    };

    function getSaltScore(product) {
        const salt = product.nutriments["salt_100g"] ?? null;
        let saltScore = null;
        if (salt !== null) {
            saltScore = salt * 40;
            saltScore = limitTo100(saltScore);
        }

        return saltScore;
    }

    function getSugarScore(product) {
        const sugar = product.nutriments["sugars_100g"] ?? null;
        let sugarScore = null;
        if (sugar !== null) {
            sugarScore = sugar * 2.22;
            sugarScore = limitTo100(sugarScore);
        }

        return sugarScore;
    }

    function getAdditivesScore(product) {
        const additives = product.additives_tags ?? null;
        let additivesScore = null;
        if (additives !== null) {
            additivesScore = 0;
            if (global.additiveScoreInformations) {
                for (const additive in additives) {
                    const additiveCode = additives[additive];
                    const additiveScore = global.additiveScoreInformations[additiveCode];
                    if (additiveScore) {
                        additivesScore += additiveScore;
                    }
                }

                additivesScore = limitTo100(additivesScore);
            }
        }

        return additivesScore;
    }

    function getEcoScore(product) {
        const eco = product.ecoscore_score ?? null;
        let ecoScore = null;
        if (eco !== null) {
            ecoScore = 100 - eco;
        }
        return ecoScore;
    }

    function getNovaScore(product) {
        const novaGroup = product.nova_group ?? null;
        let novaGroupScore = null;
        if (novaGroup !== null) {
            novaGroupScore = novaGroup * 25;
        }
        return novaGroupScore;
    }
    
    function getFatScore(product) {
        const fat = product.nutriments["fat_100g"] ?? null;
        const saturatedFat = product.nutriments["saturated-fat_100g"] ?? null;
    
        let fatScore = null;
        if (fat !== null) {
            fatScore = fat * 7.5;
        }
        if (saturatedFat !== null) {
            fatScore += saturatedFat * 2.5;
        }
        if (fatScore !== null) {
            fatScore = limitTo100(fatScore);
        }

        return fatScore;
    }

    function limitTo100(score) {
        if (score > 100) {
            score = 100;
        }

        return score;
    }
}

export default getScoresFromProduct;