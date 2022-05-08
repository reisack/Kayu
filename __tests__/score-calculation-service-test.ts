import AdditiveInformation from '../src/classes/additiveInformation';
import NutritionValues from '../src/classes/nutrition-values';
import AdditiveInformationsService from '../src/services/additive-informations-service';
import ScoreCalculationService from '../src/services/score-calculation-service';

describe('Score calculation service', () => {

  let scoreCalculationService: ScoreCalculationService;

  beforeEach(() => {
    scoreCalculationService = new ScoreCalculationService();

    // Mock static method call AdditiveInformationsService.getAdditiveScoreInformations()
    AdditiveInformationsService.getAdditiveScoreInformations = getAdditiveScoreInformationsMock;
  });

  const getAdditiveScoreInformationsMock = () => {
    return [
      new AdditiveInformation('en:e100', 30),
      new AdditiveInformation('en:e101', 15),
      new AdditiveInformation('en:e102', 5),
      new AdditiveInformation('en:e103', 30),
      new AdditiveInformation('en:e104', 30),
      new AdditiveInformation('en:e105', 10)
    ];
  };

  it('should calculate expected scores', () => {
    const additives = ['en:e100', 'en:e101', 'en:e102', 'en:e105'];
    const nutritionValues = new NutritionValues(8.42, 10, 1.2, 3, 10, additives);

    const score = scoreCalculationService.getScore(nutritionValues);

    expect(score.fat).toBeCloseTo(84.2);
    expect(score.sugar).toBeCloseTo(22.2);
    expect(score.salt).toBeCloseTo(48);
    expect(score.additives).toBeCloseTo(60);
    expect(score.novaGroup).toBeCloseTo(75);
    expect(score.eco).toBeCloseTo(90);
    expect(score.getTotal()).toBeCloseTo(379.4);
  });

  it('should limit scores to 100', () => {
    const additives = ['en:e100', 'en:e101', 'en:e102', 'en:e103', 'en:e104'];
    const nutritionValues = new NutritionValues(80, 80, 80, 5, -1, additives);

    const score = scoreCalculationService.getScore(nutritionValues);

    expect(score.fat).toEqual(100);
    expect(score.sugar).toEqual(100);
    expect(score.salt).toEqual(100);
    expect(score.additives).toEqual(100);
    expect(score.novaGroup).toEqual(100);
    expect(score.eco).toEqual(100);
    expect(score.getTotal()).toEqual(600);
  });

  it('should not calculate when scores are null or undefined', () => {
    const nutritionValues = new NutritionValues(null, undefined, null, null, undefined, undefined);

    const score = scoreCalculationService.getScore(nutritionValues);

    expect(score.fat).toBeNull();
    expect(score.sugar).toBeNull();
    expect(score.salt).toBeNull();
    expect(score.additives).toBeNull();
    expect(score.novaGroup).toBeNull();
    expect(score.eco).toBeNull();
    expect(score.getTotal()).toEqual(0);
  });

  it('additives score should be 0 when list of additives is empty', () => {
    const nutritionValues = new NutritionValues(null, null, null, null, null, []);

    const score = scoreCalculationService.getScore(nutritionValues);

    expect(score.additives).toEqual(0);
  });
});