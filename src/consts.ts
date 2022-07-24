import {IStyle} from './interfaces';

export default class Consts {
  static readonly openFoodFactAPIBaseUrl = 'https://fr.openfoodfacts.org/';
  static readonly httpHeaderGetRequest: any = {
    method: 'GET',
    headers: {
      'User-Agent': 'Kayu - Android - Version 1.0',
    },
  };
  static readonly style: IStyle = {
    primaryColor: '#1C7DB7',
    secondaryColor: '#787878',
    scaleFactor: {
      threeQuarter: 0.75,
      half: 0.5,
      third: 0.33,
      quarter: 0.25,
      oneEighth: 0.125,
      oneTwelfth: 0.09375,
      oneSixteenth: 0.0625,
      oneThirtySecond: 0.03125,
    },
  };
}
