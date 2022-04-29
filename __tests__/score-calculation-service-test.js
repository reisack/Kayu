import getScoresFromProduct from '../src/services/score-calculation-service';

describe('Score calculation service', () => {
  it('should calculate expected scores', () => {
    const nutritionValues = {
      fat: 8.42,
      sugar: 10,
      salt: 1.2,
      additives: ['en:e100', 'en:e101', 'en:e102', 'en:e105'],
      novaGroup: 3,
      eco: 10,
    };

    const scores = getScoresFromProduct(nutritionValues);

    expect(scores.fat).toBeCloseTo(84.2);
    expect(scores.sugar).toBeCloseTo(22.2);
    expect(scores.salt).toBeCloseTo(48);
    expect(scores.additives).toBeCloseTo(60);
    expect(scores.novaGroup).toBeCloseTo(75);
    expect(scores.eco).toBeCloseTo(90);
    expect(scores.getTotal()).toBeCloseTo(379.4);
  });

  it('should limit scores to 100', () => {
    const nutritionValues = {
      fat: 80,
      sugar: 80,
      salt: 80,
      additives: ['en:e100', 'en:e101', 'en:e102', 'en:e103', 'en:e104'],
      novaGroup: 5,
      eco: -1,
    };

    const scores = getScoresFromProduct(nutritionValues);

    expect(scores.fat).toEqual(100);
    expect(scores.sugar).toEqual(100);
    expect(scores.salt).toEqual(100);
    expect(scores.additives).toEqual(100);
    expect(scores.novaGroup).toEqual(100);
    expect(scores.eco).toEqual(100);
    expect(scores.getTotal()).toEqual(600);
  });

  it('should not calculate when scores are null or undefined', () => {
    const nutritionValues = {
      fat: null,
      sugar: undefined,
      salt: null,
      additives: undefined,
      novaGroup: null,
      eco: undefined,
    };

    const scores = getScoresFromProduct(nutritionValues);

    expect(scores.fat).toBeNull();
    expect(scores.sugar).toBeNull();
    expect(scores.salt).toBeNull();
    expect(scores.additives).toBeNull();
    expect(scores.novaGroup).toBeNull();
    expect(scores.eco).toBeNull();
    expect(scores.getTotal()).toEqual(0);
  });

  it('additives score should be 0 when list of additives is empty', () => {
    const nutritionValues = {
      fat: null,
      sugar: null,
      salt: null,
      additives: [],
      novaGroup: null,
      eco: null,
    };

    const scores = getScoresFromProduct(nutritionValues);

    expect(scores.additives).toEqual(0);
  });
});

/*
    jest.mock() cannot be encapsulated in a function and need to be in the same scope level as imports.
    Does not work either inside describe(), it(), beforeEach(), etc...
*/
jest.mock('../src/services/additive-informations-service', () => {
  const getAdditiveScoreInformationsMock = () => {
    return {
      'en:e100': 30,
      'en:e101': 15,
      'en:e102': 5,
      'en:e103': 30,
      'en:e104': 30,
      'en:e105': 10,
    };
  };

  // https://jestjs.io/docs/mock-functions#mocking-partials
  return {
    __esModule: true,
    getAdditiveScoreInformations: getAdditiveScoreInformationsMock,
  };
});
