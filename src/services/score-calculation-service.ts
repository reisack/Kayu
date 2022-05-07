import { Nullable } from '../classes/nullable-type';
import NutritionValues from '../classes/nutrition-values';
import Score from '../classes/score';
import {ProductInformationEnum} from '../enums';
import AdditiveInformationsService from './additive-informations-service';

export default class ScoreCalculationService {
  private nutritionValues: NutritionValues;

  constructor(nutritionValues: NutritionValues) {
    this.nutritionValues = nutritionValues;
  }

  public getScore(): Score {
    const score = new Score(
      this.getScoreByProductInformation(ProductInformationEnum.fat),
      this.getScoreByProductInformation(ProductInformationEnum.sugar),
      this.getScoreByProductInformation(ProductInformationEnum.salt),
      this.getScoreByProductInformation(ProductInformationEnum.novaGroup),
      this.getScoreByProductInformation(ProductInformationEnum.eco),
      this.getScoreByProductInformation(ProductInformationEnum.additives)
    );

    return score;
  }

  private getScoreByProductInformation(productInformation: ProductInformationEnum): number | null {
    const productInformationValue = this.getNutritionValue(productInformation);
    let score: number | null = null;
    if (
      productInformationValue !== undefined &&
      productInformationValue !== null
    ) {
      score = this.calculateScore(productInformationValue, productInformation);
    }

    return score;
  }

  private getNutritionValue(productInformation: ProductInformationEnum): Nullable<Number> | Nullable<string[]> {
    switch (productInformation) {
      case ProductInformationEnum.fat:
        return this.nutritionValues.fat;
      case ProductInformationEnum.sugar:
        return this.nutritionValues.sugar;
      case ProductInformationEnum.salt:
        return this.nutritionValues.salt;
      case ProductInformationEnum.additives:
        return this.nutritionValues.additives;
      case ProductInformationEnum.novaGroup:
        return this.nutritionValues.novaGroup;
      case ProductInformationEnum.eco:
        return this.nutritionValues.eco;
    }
  }

  private calculateScore(productInformationValue: Number | string[], productInformation: ProductInformationEnum): number | null {
    switch (productInformation) {
      case ProductInformationEnum.fat:
        return productInformationValue as number * 10;
      case ProductInformationEnum.sugar:
        return productInformationValue as number * 2.22;
      case ProductInformationEnum.salt:
        return productInformationValue as number * 40;
      case ProductInformationEnum.additives:
        return this.getAdditivesScore(productInformationValue as string[]);
      case ProductInformationEnum.novaGroup:
        return productInformationValue as number * 25;
      case ProductInformationEnum.eco:
        return 100 - (productInformationValue as number);
    }
  }

  private getAdditivesScore(productInformationValue: string[]): number | null {
    let additivesScore = null;
    if (Array.isArray(productInformationValue)) {
      const additiveScoreInformations = AdditiveInformationsService.getAdditiveScoreInformations();
      if (additiveScoreInformations) {
        additivesScore = 0;
        for (const additiveCode of productInformationValue) {
          const additiveScore = additiveScoreInformations.find(x => x.name === additiveCode);
          if (additiveScore) {
            additivesScore += additiveScore.riskScore;
          }
        }
      }
    }

    return additivesScore;
  }
}