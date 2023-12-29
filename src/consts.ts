import {IStyle} from './interfaces';

type HttpHeaderRequest = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: {
    'User-Agent': string;
  };
};

export default class Consts {
  static readonly openFoodFactAPIBaseUrl = 'https://fr.openfoodfacts.org/';
  static readonly httpHeaderGetRequest: HttpHeaderRequest = {
    method: 'GET',
    headers: {
      'User-Agent': 'Kayu - Android - Version 1.0',
    },
  };
  static readonly style: IStyle = {
    primaryColor: '#1C7DB7',
    primaryFontColor: '#FFFFFF',
    secondaryColor: '#787878',
    secondaryFontColor: '#565656',
    primaryBackgroundColor: '#DEDEDE',
    secondaryBackgroundColor: '#CDCDCD',
    tertiaryBackgroundColor: '#114E73',
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
