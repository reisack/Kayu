import AdditiveInformation from '@/classes/additive-information';
import Consts from '@/consts';

type Risk = 'en:high' | 'en:moderate' | 'en:no';

type RiskScores = {
  'en:high': number;
  'en:moderate': number;
  'en:no': number;
};

type AdditiveInformationsApiResponse = {
  [key: string]: {
    efsa_evaluation_overexposure_risk: {
      en: Risk;
    };
  };
};

export default class AdditiveInformationsService {
  private static _additiveScoreInformations: AdditiveInformation[] = [];

  public static async initAdditiveScoreInformations(): Promise<void> {
    try {
      const additivesUrl = `${Consts.openFoodFactAPIBaseUrl}data/taxonomies/additives.json`;
      const response = await fetch(additivesUrl, Consts.httpHeaderGetRequest);

      const json: AdditiveInformationsApiResponse = await response.json();
      this.setSimplifiedObject(json);
    } catch (error) {
      console.log(
        `initAdditiveScoreInformations - Cannot fetch additive informations : ${error}`,
      );
      return Promise.reject();
    }
  }

  private static setSimplifiedObject(
    jsonFromAPI: AdditiveInformationsApiResponse,
  ): void {
    const additiveScoreInformations: AdditiveInformation[] = [];
    for (const property in jsonFromAPI) {
      if (jsonFromAPI[property].efsa_evaluation_overexposure_risk?.en) {
        const risk = jsonFromAPI[property].efsa_evaluation_overexposure_risk.en;

        const riskScores: RiskScores = {
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
