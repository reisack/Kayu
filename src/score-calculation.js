const getScoresFromProduct = (product) => {
    return {
        fat: getFatScore(product),
        sugar: product.nutriments["sugars_100g"] ?? null,
        salt: product.nutriments["salt_100g"] ?? null,
        novaGroup: getNovaScore(product),
        eco: getEcoScore(product),
        additives: getAdditivesScore(product)
    };
}

export default getScoresFromProduct;

function getAdditivesScore(product) {
    const additives = product.additives_tags || null;
    let additivesScore;
    if (additives) {
        // Todo : Get additives Informations
        const additivesInformations = [];
    }
    return additivesScore;
}

function getEcoScore(product) {
    const eco = product.ecoscore_score ?? null;
    let ecoScore;
    if (eco) {
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
        fatScore = fat * 0.75;
    }
    if (saturatedFat !== null) {
        fatScore += saturatedFat * 0.25;
    }
    if (fatScore !== null) {
        fatScore = fatScore.toFixed(2);
    }
    return fatScore;
}
