export default class Consts {
  static openFoodFactAPIBaseUrl: string = 'https://fr.openfoodfacts.org/';
  static httpHeaderGetRequest: any = {
    method: 'GET',
    headers: {
      'User-Agent': 'Kayu - Android - Version 1.0'
    }
  };
}