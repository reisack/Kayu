import NutritionValues from "./nutrition-values";
import Score from "./score";

export default class Product {
  frName: string;
  brands: string;
  imageUrl: string;
  mainCategory: string;
  categories: string[];
  nutritionValues: NutritionValues;
  score: Score

  constructor(frName: string, brands: string, imageUrl: string, mainCategory: string, categories: string[], nutritionValues: NutritionValues, score: Score) {
    this.frName = frName;
    this.brands = brands;
    this.imageUrl = imageUrl;
    this.mainCategory = mainCategory;
    this.categories = categories;
    this.nutritionValues = nutritionValues;
    this.score = score;
  }

  static empty: Product = {
    frName: '',
    brands: '',
    imageUrl: '',
    mainCategory: '',
    categories: [],
    nutritionValues: new NutritionValues(),
    score: new Score()
  };
}