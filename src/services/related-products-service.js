import consts from '../consts';
import getScoresFromProduct from '../services/score-calculation-service';

const getRelatedproducts = async (category, productTotalScore) => {
  let relatedProducts = await getAllRelatedProducts();

  // Top 10 products by score
  filterProductCodesWithBestScores();

  // Randomize results
  shuffleArray(relatedProducts);

  // We finally keep only the top 5 related products
  if (relatedProducts.length > 5) {
    relatedProducts = relatedProducts.slice(0, 5);
  }

  return relatedProducts;

  async function getAllRelatedProducts() {
    const allrelatedProducts = [];

    const relatedProductsSearchUrl = `${consts.openFoodFactAPIBaseUrl}/api/v2/search`;
    const fields =
      'code,saturated-fat_100g,sugars_100g,salt_100g,additives_tags,nova_group,ecoscore_score';

    const response = await fetch(
      `${relatedProductsSearchUrl}?categories_tags_en=${category}&fields=${fields}`,
      consts.httpHeaderGetRequest,
    );
    const json = await response.json();

    if (json && json.count && json.count > 0) {
      setRelatedProductsWithTotalScore(json, allrelatedProducts);
    }

    return allrelatedProducts;
  }

  function setRelatedProductsWithTotalScore(json, allrelatedProducts) {
    for (const relatedProduct of json.products) {
      const nutritionValues = {
        fat: relatedProduct['saturated-fat_100g'],
        sugar: relatedProduct.sugars_100g,
        salt: relatedProduct.salt_100g,
        additives: relatedProduct.additives_tags,
        novaGroup: relatedProduct.nova_group,
        eco: relatedProduct.ecoscore_score,
      };

      const relatedProductScores = getScoresFromProduct(nutritionValues);
      const relatedProductTotalScore = relatedProductScores.getTotal();
      if (relatedProductTotalScore > productTotalScore) {
        allrelatedProducts.push({
          code: relatedProduct.code,
          score: relatedProductTotalScore,
        });
      }
    }
  }

  function filterProductCodesWithBestScores() {
    relatedProducts = relatedProducts.sort((a, b) => b.score - a.score);

    if (relatedProducts.length > 10) {
      relatedProducts = relatedProducts.slice(0, 10);
    }
  }

  // Fisher–Yates shuffle algorithm
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
};

export default getRelatedproducts;
