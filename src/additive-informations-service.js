const initAdditiveInformations = async () => {
    try {
        const productDetailsUrl = 'https://fr.openfoodfacts.org/data/taxonomies/additives.json';
        const response = await fetch(productDetailsUrl);
        const json = await response.json();
        setSimplifiedObject(json);
    } catch(error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
}

export default initAdditiveInformations;

const setSimplifiedObject = (jsonFromAPI) => {
    global.additiveInformations = {};
    for (const property in jsonFromAPI) {
        if (jsonFromAPI[property].efsa_evaluation_overexposure_risk
            && jsonFromAPI[property].efsa_evaluation_overexposure_risk.en) {
            const risk = jsonFromAPI[property].efsa_evaluation_overexposure_risk.en;

            switch (risk) {
                case 'en:high' :
                    global.additiveInformations[property] = 30;
                break;
                case 'en:moderate' :
                    global.additiveInformations[property] = 15;
                break;
                case 'en:no' :
                    global.additiveInformations[property] = 5;
                break;
            }
        }
    }
}