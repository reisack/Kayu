import AdditiveInformationsService from '../src/services/additive-informations-service';
import fetchMock from 'jest-fetch-mock';
import AdditiveInformation from '../src/classes/additiveInformation';

describe('Additive informations service', () => {
  it('should have additives informations when fetching risk informations', async () => {
    const additiveInformationJSON = require('./mocks/additives-mock.json');
    fetchMock.mockResponseOnce(JSON.stringify(additiveInformationJSON));

    await AdditiveInformationsService.initAdditiveScoreInformations();
    const result = AdditiveInformationsService.getAdditiveScoreInformations();

    const expected = [
      new AdditiveInformation('en:e638', 10),
      new AdditiveInformation('en:e903', 10),
      new AdditiveInformation('en:e228', 30),
      new AdditiveInformation('en:e433', 15),
      new AdditiveInformation('en:e945', 10),
      new AdditiveInformation('en:e951', 5),
      new AdditiveInformation('en:e636', 10)
    ];

    expect(result).toEqual(expected);
  });

  it('should have no additives informations when fetching no risk informations', async () => {
    const additivesInformationsWithoutRisksJSON = require('./mocks/additives-without-risks-mock.json');
    fetchMock.mockResponseOnce(
      JSON.stringify(additivesInformationsWithoutRisksJSON),
    );

    await AdditiveInformationsService.initAdditiveScoreInformations();
    const result = AdditiveInformationsService.getAdditiveScoreInformations();

    const expected = [
      new AdditiveInformation('en:e638', 10),
      new AdditiveInformation('en:e903', 10),
      new AdditiveInformation('en:e945', 10),
      new AdditiveInformation('en:e636', 10)
    ];

    expect(result).toEqual(expected);
  });

  it('should have no additives informations when fetching empty object', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));

    await AdditiveInformationsService.initAdditiveScoreInformations();
    const result = AdditiveInformationsService.getAdditiveScoreInformations();

    expect(result).toEqual([]);
  });

  it('should have no additives informations when API throw error', async () => {
    fetchMock.mockResponseOnce(() => Promise.reject());

    await AdditiveInformationsService.initAdditiveScoreInformations();
    const result = AdditiveInformationsService.getAdditiveScoreInformations();

    expect(result).toEqual([]);
  });
});
