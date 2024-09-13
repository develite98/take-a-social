import { loadTranslations } from '$lib/translations';

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {

  // Add html `lang` attribute
  return resolve({ ...event, locals: { lang: 'vi' } }, {
    transformPageChunk: ({ html }) => html.replace(/<html.*>/, `<html lang="${'vi'}">`),
  });
};


/** @type {import('@sveltejs/kit').HandleServerError} */
export const handleError = async ({ event }) => {
  const { locals } = event;
  const { lang } = locals;

  await loadTranslations(lang, 'error');

  return locals;
};