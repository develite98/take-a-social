<script>
	import { onMount } from 'svelte';
	import '../../app.scss';
	import { isLoading } from 'svelte-i18n';
	import { client } from '$lib/storage/client';

	client
		.setEndpoint('https://master-cloud-ws4zfz9eqg.protrader.tools/v1')
		.setProject('66e3bc690017f112ad9b');

	onMount(() => {
		// @ts-ignore
		window.fbAsyncInit = function () {
			// @ts-ignore
			FB.init({
				appId: '888715703203677',
				status: true,
				xfbml: true,
				version: 'v20.0'
			});
		};
	});
</script>

{#if !$isLoading}
	<div class="max-w-2xl mx-auto">
		<slot />
	</div>
{/if}

<svelte:head>
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-P4HWTZ89NM"></script>
	<script>
		window.dataLayer = window.dataLayer || [];

		function gtag() {
			dataLayer.push(arguments);
		}

		gtag('js', new Date());
		gtag('config', 'G-P4HWTZ89NM');
	</script>
</svelte:head>
