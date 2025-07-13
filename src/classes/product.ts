import NutritionValues from '@/classes/nutrition-values';
import Score from '@/classes/score';

export default class Product {
  eanCode: string;
  frName: string;
  brands: string;
  imageUrl: string;
  mainCategory: string;
  categories: string[];
  nutritionValues: NutritionValues;
  score: Score;

  constructor(
    eanCode: string,
    nutritionValues: NutritionValues,
    score: Score,
    frName?: string,
    brands?: string,
    imageUrl?: string,
    mainCategory?: string,
    categories?: string[],
  ) {
    this.eanCode = eanCode;
    this.frName = frName ?? '';
    this.brands = brands ?? '';
    this.imageUrl = imageUrl ?? '';
    this.mainCategory = mainCategory ?? '';
    this.categories = categories ?? [];
    this.nutritionValues = nutritionValues ?? new NutritionValues();
    this.score = score;
  }

  public static empty: Product = {
    eanCode: '',
    frName: '',
    brands: '',
    imageUrl: '',
    mainCategory: '',
    categories: [],
    nutritionValues: new NutritionValues(),
    score: new Score(),
  };
}
