<script lang="ts">
	import { goto } from '$app/navigation';
	import { Page } from 'konsta/svelte';
	import { locale, _ } from 'svelte-i18n';
	import { t } from '$lib/translations';

	import { client } from '$lib/storage/client';
	import { fade } from 'svelte/transition';
	
	import { Storage } from 'appwrite';
	import { page } from '$app/stores';

	const fbAppId = '888715703203677';
	const hashtags = '#4FxTeam #CafeChat #MarketBalance';
	const storage: Storage = new Storage(client);
	const file = storage.getFilePreview('66e3be700038d5567aa5', $page.params.id) || undefined;
	let isCopySuccess = false;

	function goBack() {
		goto(`/${currentLocale}`);
	}

	function openFacebookShareDialog() {
		const shareUrl = window.location.href;
		const fpShareUrl = `https://facebook.com/dialog/share?
					app_id=${fbAppId}
					&display=popup	
					&href=${encodeURIComponent(shareUrl)}
					&quote=${encodeURIComponent(hashtags)}
					&hashtag=${encodeURIComponent(hashtags)}
					&redirect_uri=${encodeURIComponent(shareUrl)}`;

		setTimeout(() => {
			window.location.href = fpShareUrl;
		}, 500);
	}

	function copyUrl() {
		navigator.clipboard
			.writeText(
				`${hashtags}
				
${window.location.href}`
			)
			.then(() => {
				isCopySuccess = true;
			})
			.catch((err) => {
				isCopySuccess = false;
			});
	}

	$: currentLocale = $locale || 'vi';
</script>

<Page>
	<div class="w-full h-full main-app max-w-2xl mx-auto">
		<div class="flex px-4 pb-4 pt-[8vh] justify-center">
			<img class="w-[60px]" src="/logo.png" alt="Trung Nguyên E-Coffee" />
		</div>

		<h2 class="font-title text-2xl text-center px-6 mt-2 mb-4">
			<div class="text-6xl">
				{$t('common.title')}
			</div>
			VOLUME TRADING
		</h2>


		<div
			class="p-2 m-4 bg-white rounded-lg border border-dashed border-gray-300 h-[30vh] flex justify-center"
		>
			<img
				class="rounded-lg h-full object-cover aspect-square"
				src={file?.href || 'https://images6.alphacoders.com/134/1348908.jpeg'}
				alt=""
			/>
		</div>

		<div
			class="justify-center w-3/4 text-center text-[14px] mx-auto leading-2 mt-8"
			style="line-height: 1.5;"
		>
			{#each hashtags.split(' ') as tag}
			<div>
				<span class="font-bold">{tag}</span>
			</div>
			{/each}
		</div>

		<div class="flex justify-center mt-4 gap-2">
			{#if isCopySuccess}
				<div class="flex flex-col gap-1 items-center">
					<div class="flex w-full gap-1">
						<button
							on:click={goBack}
							class="bg-white active:bg-gray-100 active:scale-95 trasition-all font-title text-lg px-4 py-2 rounded-lg border border-dashed border-gray-300 flex items-center gap-2"
						>
							<img src="/back-arrow.svg" class=" w-4 h-4 inline-flex -mt-2" alt="Checkin" />
						</button>

						<button
							on:click={openFacebookShareDialog}
							class="bg-white active:bg-gray-100 active:scale-95 trasition-all font-title text-lg px-4 py-2 rounded-lg border border-dashed border-gray-300 flex items-center gap-2"
						>
							<img src="/fb-logo.png" class=" w-4 h-4 inline-flex -mt-1" alt="Checkin" />
							{$t('common.sharing')}
						</button>
					</div>

					<div
						class="text-green-500 animate-bounce mt-2 text-[14px]"
						transition:fade={{ delay: 50, duration: 200 }}
					>
						✅ {$t('common.copied')} #hashtag
					</div>
				</div>
			{:else}
				<button
					on:click={goBack}
					class="bg-white active:bg-gray-100 active:scale-95 trasition-all font-title text-lg px-4 py-2 rounded-lg border border-dashed border-gray-300 flex items-center gap-2"
				>
					<img src="/back-arrow.svg" class=" w-4 h-4 inline-flex -mt-2" alt="Checkin" />
				</button>

				<button
					on:click={copyUrl}
					class="bg-white active:bg-gray-100 active:scale-95 trasition-all font-title text-lg px-4 py-2 rounded-lg border border-dashed border-gray-300 flex items-center gap-2"
				>
					<img src="/coffee-cup.svg" class=" w-4 h-4 inline-flex -mt-2" alt="Checkin" />
					{$t('common.shareLabel')}
				</button>
			{/if}
		</div>
	</div>
</Page>

<svelte:head>
	<meta property="og:title" content="4FX | HCMC Volume Trading" />
	<meta property="og:description" content="Cảm ơn quý khách" />

	<meta property="og:url" content={$page.url.href} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:site_name" content="4FX | HCMC Volume Trading" />

	<meta property="fb:app_id" content={fbAppId} />
	<meta property="fb:page_id" content={fbAppId} />
	<meta property="og:image" content={file.href} />

	<meta property="og:url" content={$page.url.href} />

	<meta property="og:type" content="website" />
	<meta property="og:locale" content="en_US" />
	<!-- Optional: Facebook App ID -->
</svelte:head>

<style>
	.main-app {
		background-image: url('/background.jpg');
		background-size: cover;
		background-repeat: no-repeat;
	}
</style>
