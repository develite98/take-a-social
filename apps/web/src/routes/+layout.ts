import { addTranslations, setLocale, setRoute } from '$lib/translations';

/** @type {import('@sveltejs/kit').LayoutLoad} */
export const load = async ({ data }) => {
  const { i18n, translations } = data;
  const { lang } = i18n;

  addTranslations(translations);

  await setRoute(i18n.route);
  await setLocale(lang);

  return i18n;
};