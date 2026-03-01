import i18n from 'i18next';
// eslint-disable-next-line
import { initReactI18next } from 'react-i18next';

import common from '../../public/locales/en/common.json';
import organisationOverview from '../../public/locales/en/organisationOverview.json';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',

  ns: ['common'],
  defaultNS: 'common',

  // debug: true,

  resources: { en: { organisationOverview, common } },
});

export { i18n };
