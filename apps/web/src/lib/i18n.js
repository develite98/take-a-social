// src/lib/i18n/index.ts
import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

const defaultLocale = 'vi';

register('en', () => import('./locales/en.json'));
register('vi', () => import('./locales/vi.json'));

export const initI18n = () => {
	init({
		fallbackLocale: defaultLocale,
		initialLocale: browser ? window.navigator.language : defaultLocale
	});
};
