import initI18n from '@/services/i18n-service';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from 'assets/i18n/fr.json';

jest.mock('i18next', () => ({
  __esModule: true,
  default: {
    use: jest.fn(),
    init: jest.fn(),
  },
}));

jest.mock('react-i18next', () => ({
  initReactI18next: 'init-react-i18next-plugin',
}));

describe('i18n service', () => {
  const mockedI18n = i18n as unknown as {
    use: jest.Mock;
    init: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedI18n.use.mockReturnValue(mockedI18n);
  });

  it('should initialize i18n with french resources and fallback configuration', () => {
    initI18n();

    expect(mockedI18n.use).toHaveBeenCalledWith(initReactI18next);
    expect(mockedI18n.init).toHaveBeenCalledWith({
      compatibilityJSON: 'v4',
      resources: {
        fr: {
          translation: fr,
        },
      },
      lng: 'fr',
      fallbackLng: 'fr',
      interpolation: {
        escapeValue: false,
      },
    });
  });
});
