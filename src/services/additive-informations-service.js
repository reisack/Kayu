const initAdditiveScoreInformations = async () => {
    try {
        const additivesUrl = 'https://fr.openfoodfacts.org/data/taxonomies/additives.json';
        const response = await fetch(additivesUrl);
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
    
                switch (risk) {
                    case 'en:high' :
                        global.additiveScoreInformations[property] = 30;
                    break;
                    case 'en:moderate' :
                        global.additiveScoreInformations[property] = 15;
                    break;
                    case 'en:no' :
                        global.additiveScoreInformations[property] = 5;
                    break;
                }
            }
        }
    }
}

export default initAdditiveScoreInformations;