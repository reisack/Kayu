import NutritionValues from '../classes/nutrition-values';
import Product from '../classes/product';
import Score from '../classes/score';
import consts from '../consts';
import ScoreCalculationService from './score-calculation-service';
import '../extensions'; // needed for clear method extension (for arrays)
import {Nullable} from '../extensions';
import {ProductApi} from '../shared-types';

type ProductsApiResponse = {
  products: ProductApi[];
  count: Nullable<number>;
};

export default class RelatedProductsService {
  private readonly searchProductsUrl = `${consts.openFoodFactAPIBaseUrl}api/v2/search`;
  private scoreCalculationService: ScoreCalculationService;

  constructor() {
    this.scoreCalculationService = new ScoreCalculationService();
  }

  public async getRelatedproducts(
    category: string,
    productTotalScore: number,
  ): Promise<Product[]> {
    let relatedProducts: Product[] =
      await this.getAllRelatedProductsWithNutritionInformations(
        category,
        productTotalScore,
      );

    if (relatedProducts.length === 0) {
      return [];
    }

    // Top 10 products by score
    relatedProducts = this.filterProductCodesWithBestScores(relatedProducts);

    // Randomize results
    this.shuffleArray(relatedProducts);

    // We finally keep only the top 5 related products
    if (relatedProducts.length > 5) {
      relatedProducts = relatedProducts.slice(0, 5);
    }

    await this.completeRelatedProductsWithAllInformations(
      relatedProducts,
      category,
    );

    return relatedProducts;
  }

  private async getAllRelatedProductsWithNutritionInformations(
    category: string,
    productTotalScore: number,
  ): Promise<Product[]> {
    const relatedProducts: Product[] = [];

    try {
      const fields =
        'code,saturated-fat_100g,sugars_100g,salt_100g,additives_tags,nova_group,ecoscore_score';

      const response = await fetch(
        `${this.searchProductsUrl}?categories_tags_en=${category}&fields=${fields}&page_size=100`,
        consts.httpHeaderGetRequest,
      );
      const json: ProductsApiResponse = await response.json();

      if (json && json.count && json.count > 0) {
        this.setRelatedProductsWithTotalScore(
          relatedProducts,
          json,
          productTotalScore,
        );
      }
    } catch (error) {
      // We reset products list if API throws an error
      relatedProducts.clear();
    }

    return relatedProducts;
  }

  private setRelatedProductsWithTotalScore(
    relatedProducts: Product[],
    json: ProductsApiResponse,
    productTotalScore: number,
  ): void {
    for (const relatedProduct of json.products) {
      const nutritionValues: NutritionValues = {
        fat: relatedProduct['saturated-fat_100g'],
        sugar: relatedProduct.sugars_100g,
        salt: relatedProduct.salt_100g,
        additives: relatedProduct.additives_tags,
        novaGroup: relatedProduct.nova_group,
        eco: relatedProduct.ecoscore_score,
      };

      const relatedProductScore: Score =
        this.scoreCalculationService.getScore(nutritionValues);
      const relatedProductTotalScore: number = relatedProductScore.getTotal();

      if (relatedProductTotalScore > productTotalScore) {
        relatedProducts.push(
          new Product(
            relatedProduct.code,
            nutritionValues,
            relatedProductScore,
          ),
        );
      }
    }
  }

  private filterProductCodesWithBestScores(
    relatedProducts: Product[],
  ): Product[] {
    relatedProducts = relatedProducts.sort(
      (a, b) => b.score.getTotal() - a.score.getTotal(),
    );

    if (relatedProducts.length > 10) {
      relatedProducts = relatedProducts.slice(0, 10);
    }

    return relatedProducts;
  }

  // Fisher–Yates shuffle algorithm
  private shuffleArray(array: Product[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private async completeRelatedProductsWithAllInformations(
    relatedProducts: Product[],
    category: string,
  ): Promise<void> {
    try {
      const fields = 'code,product_name_fr,brands,image_front_url';
      const eanCodes = relatedProducts.map(p => p.eanCode).join(',');

      const response = await fetch(
        `${this.searchProductsUrl}?categories_tags_en=${category}&fields=${fields}&code=${eanCodes}`,
        consts.httpHeaderGetRequest,
      );

      const json: ProductsApiResponse = await response.json();
      if (json && json.count && json.count > 0) {
        for (const relatedProduct of json.products) {
          const product = relatedProducts.find(
            p => p.eanCode === relatedProduct.code,
          );

          if (product) {
            product.frName = relatedProduct.product_name_fr;
            product.brands = relatedProduct.brands;
            product.imageUrl = relatedProduct.image_front_url;
          }
        }
      }
    } catch (error) {
      // We reset products list if API throws an error
      relatedProducts.clear();
    }
  }
}
