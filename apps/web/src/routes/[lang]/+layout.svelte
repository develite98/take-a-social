<script>
	import { onMount } from 'svelte';
	import '../../app.scss';
	import { isLoading } from 'svelte-i18n';
	import { client } from '$lib/storage/client';
	import { fly } from 'svelte/transition';

	let appActive = false;
	let showFlash = true;

	client
		.setEndpoint('https://master-cloud-ws4zfz9eqg.protrader.tools/v1')
		.setProject('66e3bc690017f112ad9b');

	onMount(() => {
		appActive = true;
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

		setTimeout(() => {
			appActive = false;
		}, 1500);

		setTimeout(() => {
			showFlash = false;
		}, 2000);
	});
</script>

{#if !$isLoading}
	{#if showFlash}
		<div
			class="w-[100vw] h-[100vh] bg-white fixed top-0 left-0 z-20 flex items-center justify-center flex-col"
		>
			<a class="w-1/2 flex flex-col items-end" href="https://mixcore.studio/">
				<img class="block fly-in-left" class:active={appActive} src="/logo-2.png" alt="Mixcore" />
				<img
					class:active={appActive}
					class="w-1/2 block fly-in-right"
					src="/logo-1.png"
					alt="Mixcore"
				/>
			</a>
		</div>
	{/if}

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

<style>
	.fly-in-left {
		opacity: 0;
		transform: translateX(-100%); /* Start off-screen to the left */
		transition:
			transform 0.5s ease-out,
			opacity 0.5s ease-out;
	}

	.fly-in-left.active {
		opacity: 1;
		transform: translateX(0); /* Move to the normal position */
	}

	.fly-in-right {
		opacity: 0;
		transform: translateX(100%); /* Start off-screen to the right */
		transition:
			transform 0.5s ease-out,
			opacity 0.5s ease-out;
	}

	.fly-in-right.active {
		opacity: 1;
		transform: translateX(0); /* Move to the normal position */
	}
</style>
