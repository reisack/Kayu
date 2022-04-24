import consts from '../consts';

const initAdditiveScoreInformations = async () => {
  global.additiveScoreInformations = {};

  try {
    const additivesUrl = `${consts.openFoodFactAPIBaseUrl}data/taxonomies/additives.json`;
    const response = await fetch(additivesUrl, consts.httpHeaderGetRequest);
    const json = await response.json();
    setSimplifiedObject(json);
  } catch (error) {
    console.error(error);
  }

  function setSimplifiedObject(jsonFromAPI) {
    for (const property in jsonFromAPI) {
      if (
        jsonFromAPI[property].efsa_evaluation_overexposure_risk &&
        jsonFromAPI[property].efsa_evaluation_overexposure_risk.en
      ) {
        const risk = jsonFromAPI[property].efsa_evaluation_overexposure_risk.en;

        const riskScores = {
          'en:high': 30,
          'en:moderate': 15,
          'en:no': 5,
        };

        global.additiveScoreInformations[property] = riskScores[risk];
      } else {
        // Unknown risk : we assume a score between no and moderate risk
        global.additiveScoreInformations[property] = 10;
      }
    }
  }
};

const getAdditiveScoreInformations = () => {
  return global.additiveScoreInformations;
};

export {initAdditiveScoreInformations, getAdditiveScoreInformations};
