import { browser } from '$app/environment'
import { initI18n } from '$lib/i18n'
import { locale, waitLocale } from 'svelte-i18n'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async () => {
    initI18n();
	if (browser) {
		locale.set(window.navigator.language)
	}

	await waitLocale()
}