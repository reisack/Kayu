import scoreProductService from '../src/services/score-product-service';
import productInformationEnum from '../src/enums/product-information';

describe('Score product service', () => {
  it('should return high score expression for fat, when score is equal to 50', () => {
    const result = scoreProductService.getExpression(
      50,
      productInformationEnum.fat,
    );
    expect(result).toEqual('score.expression.fatHigh');
  });

  it('should return high score expression for sugar, when score is strictly higher than 50', () => {
    const result = scoreProductService.getExpression(
      51,
      productInformationEnum.sugar,
    );
    expect(result).toEqual('score.expression.sugarHigh');
  });

  it('should return high score expression for salt, when score is stricly lower than 50', () => {
    const result = scoreProductService.getExpression(
      49,
      productInformationEnum.salt,
    );
    expect(result).toEqual('score.expression.saltLow');
  });

  it('should return help message for additives', () => {
    const result = scoreProductService.getHelpMessage(
      productInformationEnum.additives,
    );
    expect(result).toEqual('score.help.additives');
  });

  it('should return help message for novaGroup', () => {
    const result = scoreProductService.getHelpMessage(
      productInformationEnum.novaGroup,
    );
    expect(result).toEqual('score.help.novaGroup');
  });
});
