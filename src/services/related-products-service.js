import consts from '../consts';
import getScoresFromProduct from '../services/score-calculation-service';

const getRelatedproducts = async (category, productTotalScore) => {
  let relatedProductsWithNutrition =
    await getAllRelatedProductsWithNutritionInformations();

  if (relatedProductsWithNutrition.length === 0) {
    return [];
  }

  // Top 10 products by score
  filterProductCodesWithBestScores(relatedProductsWithNutrition);

  // Randomize results
  shuffleArray(relatedProductsWithNutrition);

  // We finally keep only the top 5 related products
  if (relatedProductsWithNutrition.length > 5) {
    relatedProductsWithNutrition = relatedProductsWithNutrition.slice(0, 5);
  }

  const relatedProducts = await getRelatedProductsWithAllInformations(
    relatedProductsWithNutrition,
  );

  return relatedProducts;

  // Private methods

  async function getAllRelatedProductsWithNutritionInformations() {
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
          scores: relatedProductScores,
        });
      }
    }
  }

  function filterProductCodesWithBestScores(productArray) {
    productArray = productArray.sort(
      (a, b) => b.scores.getTotal() - a.scores.getTotal(),
    );

    if (productArray.length > 10) {
      productArray = productArray.slice(0, 10);
    }
  }

  // Fisher–Yates shuffle algorithm
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  async function getRelatedProductsWithAllInformations(
    relatedProductsNutrition,
  ) {
    const relatedProductsWithAllInformations = [];
    const relatedProductsSearchUrl = `${consts.openFoodFactAPIBaseUrl}/api/v2/search`;
    const fields = 'product_name_fr,brands,image_front_url';
    const eanCodes = relatedProductsNutrition.map(p => p.code).join(',');

    const response = await fetch(
      `${relatedProductsSearchUrl}?categories_tags_en=${category}&fields=${fields}&code=${eanCodes}`,
      consts.httpHeaderGetRequest,
    );

    const json = await response.json();
    if (json && json.count && json.count > 0) {
      for (const relatedProduct of json.products) {
        const product = relatedProductsNutrition.find(
          p => p.code === relatedProduct.code,
        );

        if (product) {
          delete relatedProduct.code;
          relatedProductsWithAllInformations.push({
            ...product,
            ...relatedProduct,
          });
        }
      }
    }

    return relatedProductsWithAllInformations;
  }
};

export default getRelatedproducts;
