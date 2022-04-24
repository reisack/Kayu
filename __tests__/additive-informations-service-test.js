import { initAdditiveScoreInformations, getAdditiveScoreInformations } from '../src/services/additive-informations-service';

describe('Additive informations service', () => {
    it('should have additives informations when fetching risk informations', async () => {
        const additiveInformationJSON = require('./mocks/additives-mock.json');
        fetch.mockResponseOnce(JSON.stringify(additiveInformationJSON));

        await initAdditiveScoreInformations();
        const result = getAdditiveScoreInformations();

        const expected = {
            'en:e638': 10,
            'en:e903': 10,
            'en:e228': 30,
            'en:e433': 15,
            'en:e945': 10,
            'en:e951': 5,
            'en:e636': 10
        };

        expect(result).toEqual(expected);
    });

    it('should have no additives informations when fetching no risk informations', async () => {
        const additivesInformationsWithoutRisksJSON = require('./mocks/additives-without-risks-mock.json');
        fetch.mockResponseOnce(JSON.stringify(additivesInformationsWithoutRisksJSON));

        await initAdditiveScoreInformations();
        const result = getAdditiveScoreInformations();

        const expected = {
            'en:e638': 10,
            'en:e903': 10,
            'en:e945': 10,
            'en:e636': 10
        };

        expect(result).toEqual(expected);
    });
    
    it('should have no additives informations when fetching empty object', async () => {
        fetch.mockResponseOnce({});

        await initAdditiveScoreInformations();
        const result = getAdditiveScoreInformations();

        expect(result).toEqual({});
    });

    it('should have no additives informations when API throw error', async () => {
        fetch.mockResponseOnce(() => Promise.reject());

        await initAdditiveScoreInformations();
        const result = getAdditiveScoreInformations();

        expect(result).toEqual({});
    });
});