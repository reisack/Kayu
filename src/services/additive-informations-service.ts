import AdditiveInformation from '../classes/additive-information';
import Consts from '../consts';

export default class AdditiveInformationsService {
  private static _additiveScoreInformations: AdditiveInformation[] = [];

  public static async initAdditiveScoreInformations(): Promise<void> {
    try {
      const additivesUrl = `${Consts.openFoodFactAPIBaseUrl}data/taxonomies/additives.json`;
      const response = await fetch(additivesUrl, Consts.httpHeaderGetRequest);
      const json = await response.json();
      this.setSimplifiedObject(json);
    } catch (error) {
      console.error(error);
    }
  }

  private static setSimplifiedObject(jsonFromAPI: any): void {
    const additiveScoreInformations: AdditiveInformation[] = [];
    for (const property in jsonFromAPI) {
      if (
        jsonFromAPI[property].efsa_evaluation_overexposure_risk &&
        jsonFromAPI[property].efsa_evaluation_overexposure_risk.en
      ) {
        const risk = jsonFromAPI[property].efsa_evaluation_overexposure_risk.en;

        const riskScores: any = {
          'en:high': 30,
          'en:moderate': 15,
          'en:no': 5,
        };

        additiveScoreInformations.push(
          new AdditiveInformation(property, riskScores[risk]),
        );
      } else {
        // Unknown risk : we assume a score between no and moderate risk
        additiveScoreInformations.push(new AdditiveInformation(property, 10));
      }
    }

    AdditiveInformationsService._additiveScoreInformations =
      additiveScoreInformations;
  }

  public static getAdditiveScoreInformations(): ReadonlyArray<AdditiveInformation> {
    return AdditiveInformationsService._additiveScoreInformations;
  }
}
