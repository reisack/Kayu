import NutritionValues from '@/classes/nutrition-values';
import Score from '@/classes/score';

type ProductCategory = {
  mainCategory: string;
  categories: string[]
}

export default class Product {
  eanCode: string;
  frName: string;
  brands: string;
  imageUrl: string;
  category: ProductCategory;
  nutritionValues: NutritionValues;
  score: Score;

  constructor(
    eanCode: string,
    nutritionValues: NutritionValues,
    score: Score,
    frName?: string,
    brands?: string,
    imageUrl?: string,
    category?: ProductCategory,
  ) {
    this.eanCode = eanCode;
    this.frName = frName ?? '';
    this.brands = brands ?? '';
    this.imageUrl = imageUrl ?? '';
    this.nutritionValues = nutritionValues ?? new NutritionValues();
    this.score = score;

    this.category = {
      mainCategory: category?.mainCategory ?? '',
      categories: category?.categories ?? []
    };
  }

  public static readonly empty: Product = {
    eanCode: '',
    frName: '',
    brands: '',
    imageUrl: '',
    category: { mainCategory: '' ,categories: []},
    nutritionValues: new NutritionValues(),
    score: new Score(),
  };
}
