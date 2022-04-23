import consts from '../consts';

const initAdditiveScoreInformations = async () => {
    try {
        const additivesUrl = `${consts.openFoodFactAPIBaseUrl}data/taxonomies/additives.json`;
        const response = await fetch(additivesUrl, consts.httpHeaderGetRequest);
        const json = await response.json();
        setSimplifiedObject(json);
    } catch(error) {
        console.error(error);
    }

    function setSimplifiedObject(jsonFromAPI) {
        global.additiveScoreInformations = {};
        for (const property in jsonFromAPI) {
            if (jsonFromAPI[property].efsa_evaluation_overexposure_risk
                && jsonFromAPI[property].efsa_evaluation_overexposure_risk.en) {
                const risk = jsonFromAPI[property].efsa_evaluation_overexposure_risk.en;

                const riskScores = {
                    'en:high': 30,
                    'en:moderate': 15,
                    'en:no': 5
                };

                global.additiveScoreInformations[property] = riskScores[risk];
            }
        }
    }
};

const getAdditiveScoreInformations = () => {
    return global.additiveScoreInformations;
};

export { initAdditiveScoreInformations, getAdditiveScoreInformations };