import ProductScoreService from '../src/services/product-score-service';
import {ProductInformationEnum} from '../src/enums';

describe('Score product service', () => {
  let productScoreService: ProductScoreService;

  beforeEach(() => {
    productScoreService = new ProductScoreService();
  });

  it('should return high score expression for fat, when score is equal to 50', () => {
    const result = productScoreService.getExpression(
      50,
      ProductInformationEnum.fat,
    );
    expect(result).toEqual('score.expression.fatHigh');
  });

  it('should return high score expression for sugar, when score is strictly higher than 50', () => {
    const result = productScoreService.getExpression(
      51,
      ProductInformationEnum.sugar,
    );
    expect(result).toEqual('score.expression.sugarHigh');
  });

  it('should return high score expression for salt, when score is stricly lower than 50', () => {
    const result = productScoreService.getExpression(
      49,
      ProductInformationEnum.salt,
    );
    expect(result).toEqual('score.expression.saltLow');
  });

  it('should return help message for additives', () => {
    const result = productScoreService.getHelpMessage(
      ProductInformationEnum.additives,
    );
    expect(result).toEqual('score.help.additives');
  });

  it('should return help message for novaGroup', () => {
    const result = productScoreService.getHelpMessage(
      ProductInformationEnum.novaGroup,
    );
    expect(result).toEqual('score.help.novaGroup');
  });

  it('should return label for sugar', () => {
    const result = productScoreService.getNutritionLabel(
      ProductInformationEnum.sugar,
    );
    expect(result).toEqual('nutrition.sugar');
  });

  it('should return label for salt', () => {
    const result = productScoreService.getNutritionLabel(
      ProductInformationEnum.salt,
    );
    expect(result).toEqual('nutrition.salt');
  });
});
