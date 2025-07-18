import { ProductInformationEnum } from '@/enums';

export default class ProductScoreService {
  public getExpression(
    score: number,
    productInfo: ProductInformationEnum,
  ): string {
    const expressions = {
      [ProductInformationEnum.fat]: {
        low: 'score.expression.fatLow',
        high: 'score.expression.fatHigh',
      },
      [ProductInformationEnum.sugar]: {
        low: 'score.expression.sugarLow',
        high: 'score.expression.sugarHigh',
      },
      [ProductInformationEnum.salt]: {
        low: 'score.expression.saltLow',
        high: 'score.expression.saltHigh',
      },
      [ProductInformationEnum.additives]: {
        low: 'score.expression.additivesLow',
        high: 'score.expression.additivesHigh',
      },
      [ProductInformationEnum.novaGroup]: {
        low: 'score.expression.novaGroupLow',
        high: 'score.expression.novaGroupHigh',
      },
      [ProductInformationEnum.eco]: {
        low: 'score.expression.ecoLow',
        high: 'score.expression.ecoHigh',
      },
    };

    const productExpressions = expressions[productInfo];
    return score >= 50 ? productExpressions.high : productExpressions.low;
  }

  public getHelpMessage(productInfo: ProductInformationEnum): string {
    const expressions = {
      [ProductInformationEnum.fat]: 'score.help.fat',
      [ProductInformationEnum.sugar]: 'score.help.sugar',
      [ProductInformationEnum.salt]: 'score.help.salt',
      [ProductInformationEnum.additives]: 'score.help.additives',
      [ProductInformationEnum.novaGroup]: 'score.help.novaGroup',
      [ProductInformationEnum.eco]: 'score.help.eco',
    };

    return expressions[productInfo];
  }

  public getNutritionLabel(productInfo: ProductInformationEnum): string {
    const expressions = {
      [ProductInformationEnum.fat]: 'nutrition.fat',
      [ProductInformationEnum.sugar]: 'nutrition.sugar',
      [ProductInformationEnum.salt]: 'nutrition.salt',
      [ProductInformationEnum.additives]: 'nutrition.additives',
      [ProductInformationEnum.novaGroup]: 'nutrition.novaGroup',
      [ProductInformationEnum.eco]: 'nutrition.eco',
    };

    return expressions[productInfo];
  }
}
