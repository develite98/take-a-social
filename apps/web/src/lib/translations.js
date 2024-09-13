import i18n from 'sveltekit-i18n';

export const defaultLocale = 'vi';

/** @type {import('sveltekit-i18n').Config} */
const config = ({
  loaders: [
    {
      locale: 'vi',
      key: 'common',
      loader: async () => (
        await import('./locales/vi.json')
      ).default,
    },
    {
      locale: 'en',
      key: 'common',
      loader: async () => (
        await import('./locales/en.json')
      ).default,
    }
  ],
});

export const { t, locale, locales, loading, loadTranslations, addTranslations, setLocale, setRoute, translations } = new i18n(config);