import NutritionValues from '@/classes/nutrition-values';
import Score from '@/classes/score';
import AdditiveInformationsService from '@/services/additive-informations-service';

export default class ScoreCalculationService {
  public getScore(nutritionValues: NutritionValues): Score {
    const fat = this.canBeCalculated(nutritionValues.fat)
      ? nutritionValues.fat! * 10
      : null;
    const sugar = this.canBeCalculated(nutritionValues.sugar)
      ? nutritionValues.sugar! * 2.22
      : null;
    const salt = this.canBeCalculated(nutritionValues.salt)
      ? nutritionValues.salt! * 40
      : null;
    const novaGroup = this.canBeCalculated(nutritionValues.novaGroup)
      ? nutritionValues.novaGroup! * 25
      : null;
    const eco = this.canBeCalculated(nutritionValues.eco)
      ? 100 - nutritionValues.eco!
      : null;
    const additives = this.canBeCalculated(nutritionValues.additives)
      ? this.getAdditivesScore(nutritionValues.additives!)
      : null;

    return new Score(fat, sugar, salt, novaGroup, eco, additives);
  }

  private canBeCalculated(nutritionValue: unknown): boolean {
    return nutritionValue !== undefined && nutritionValue !== null;
  }

  private getAdditivesScore(productInformationValue: string[]): number | null {
    let additivesScore = null;
    if (Array.isArray(productInformationValue)) {
      const additiveScoreInformations =
        AdditiveInformationsService.getAdditiveScoreInformations();
      if (additiveScoreInformations) {
        additivesScore = 0;
        for (const additiveCode of productInformationValue) {
          const additiveScore = additiveScoreInformations.find(
            x => x.name === additiveCode,
          );
          if (additiveScore) {
            additivesScore += additiveScore.riskScore;
          }
        }
      }
    }

    return additivesScore;
  }
}
