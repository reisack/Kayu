import NutritionValues from '@/classes/nutrition-values';
import Product from '@/classes/product';
import Score from '@/classes/score';
import consts from '@/consts';
import ScoreCalculationService from '@/services/score-calculation-service';
import '@/extensions'; // needed for clear method extension (for arrays)
import { Nullable } from '@/extensions';
import { ProductApi } from '@/shared-types';

type ProductsApiResponse = {
  products: ProductApi[];
  count: Nullable<number>;
};

export default class RelatedProductsService {
  private static readonly maxRetryAttempts = 2;
  private readonly searchProductsUrl = `${consts.openFoodFactAPIBaseUrl}api/v2/search`;
  private readonly scoreCalculationService: ScoreCalculationService;

  constructor(private readonly retryDelayMs = 500) {
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

    return relatedProducts;
  }

  private async getAllRelatedProductsWithNutritionInformations(
    category: string,
    productTotalScore: number,
  ): Promise<Product[]> {
    const relatedProducts: Product[] = [];

    try {
      const fields =
        'code,product_name_fr,brands,image_front_url,saturated-fat_100g,sugars_100g,salt_100g,additives_tags,nova_group,ecoscore_score';
      const url = `${this.searchProductsUrl}?categories_tags_en=${category}&fields=${fields}&page_size=100`;
      const json = await this.fetchProductsWithRetry(url);

      if (json?.count && json.count > 0) {
        this.setRelatedProductsWithTotalScore(
          relatedProducts,
          json,
          productTotalScore,
        );
      }
    } catch (error) {
      // We reset products list if API throws an error
      console.log(
        `getAllRelatedProductsWithNutritionInformations - Cannot fetch related products : ${error}`,
      );
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
            relatedProduct.product_name_fr,
            relatedProduct.brands,
            relatedProduct.image_front_url,
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

  private async fetchProductsWithRetry(
    url: string,
  ): Promise<ProductsApiResponse> {
    for (
      let attempt = 0;
      attempt <= RelatedProductsService.maxRetryAttempts;
      attempt++
    ) {
      const response = await fetch(url, consts.httpHeaderGetRequest);

      if (response.ok) {
        return await response.json();
      }

      if (
        this.shouldRetry(response.status) &&
        attempt < RelatedProductsService.maxRetryAttempts
      ) {
        await this.waitBeforeRetry(attempt);
        continue;
      }

      throw new Error(
        `OpenFoodFacts search failed with status ${response.status}`,
      );
    }

    throw new Error('OpenFoodFacts search failed');
  }

  private shouldRetry(status: number): boolean {
    return status === 429 || status === 503;
  }

  private async waitBeforeRetry(attempt: number): Promise<void> {
    const retryDelayMs = this.retryDelayMs * 2 ** attempt;
    await new Promise(resolve => setTimeout(resolve, retryDelayMs));
  }
}
