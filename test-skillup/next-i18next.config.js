// @ts-check

/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
