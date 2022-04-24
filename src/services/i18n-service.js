import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import fr from '../../assets/i18n/fr.json';

const initI18n = () => {
  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    resources: {
      fr: {
        translation: fr,
      },
    },
    lng: 'fr', // if you're using a language detector, do not define the lng option
    fallbackLng: 'fr',

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });
};

export default initI18n;
