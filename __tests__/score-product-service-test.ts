import ScoreProductService from '../src/services/score-product-service';
import {ProductInformationEnum} from '../src/enums';

describe('Score product service', () => {
  let scoreProductService: ScoreProductService;

  beforeEach(() => {
    scoreProductService = new ScoreProductService();
  });

  it('should return high score expression for fat, when score is equal to 50', () => {
    const result = scoreProductService.getExpression(
      50,
      ProductInformationEnum.fat,
    );
    expect(result).toEqual('score.expression.fatHigh');
  });

  it('should return high score expression for sugar, when score is strictly higher than 50', () => {
    const result = scoreProductService.getExpression(
      51,
      ProductInformationEnum.sugar,
    );
    expect(result).toEqual('score.expression.sugarHigh');
  });

  it('should return high score expression for salt, when score is stricly lower than 50', () => {
    const result = scoreProductService.getExpression(
      49,
      ProductInformationEnum.salt,
    );
    expect(result).toEqual('score.expression.saltLow');
  });

  it('should return help message for additives', () => {
    const result = scoreProductService.getHelpMessage(
      ProductInformationEnum.additives,
    );
    expect(result).toEqual('score.help.additives');
  });

  it('should return help message for novaGroup', () => {
    const result = scoreProductService.getHelpMessage(
      ProductInformationEnum.novaGroup,
    );
    expect(result).toEqual('score.help.novaGroup');
  });
});
