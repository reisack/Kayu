export default class Consts {
  static readonly openFoodFactAPIBaseUrl = 'https://fr.openfoodfacts.org/';
  static readonly httpHeaderGetRequest: any = {
    method: 'GET',
    headers: {
      'User-Agent': 'Kayu - Android - Version 1.0',
    },
  };
  static readonly primaryColor: string = '#1C7DB7';
}
