<script lang="ts">
	import { goto } from '$app/navigation';
	import { Page } from 'konsta/svelte';
	import { locale, _ } from 'svelte-i18n';
	import { t } from '$lib/translations';
	import { client } from '$lib/storage/client';
	import { Storage } from 'appwrite';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';

	const fbAppId = '888715703203677';
	const hashtags = '#TrungNguyenEcoffee #3nenVanMinhCaPhe #TinhHoaHoiTu';
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
			<img class="w-[200px]" src="/logo.png" alt="Trung Nguyên E-Coffee" />
		</div>

		<h2 class="font-title text-base text-center px-6 mt-2 text-[#42201A]">
			Hội thảo nhượng quyền <br /> Trung Nguyên E-Coffee
		</h2>

		<div
			class="p-2 m-4 rounded-lg border border-dashed border-gray-300 h-[30vh] flex justify-center"
		>
			<img
				class="rounded-lg h-full object-cover aspect-square"
				src={file?.href || 'https://images6.alphacoders.com/134/1348908.jpeg'}
				alt=""
			/>
		</div>

		<div
			class="flex justify-center w-3/4 text-center text-[15px] mx-auto leading-2"
			style="line-height: 1.5;"
		>
			{hashtags.split(' ').join(', ')}
		</div>

		<!-- <div class="flex justify-center mt-4 gap-2">
			{#if isCopySuccess}
				<div class="flex flex-col gap-1 items-center">
					<div class="flex w-full gap-1">
						<button
							on:click={goBack}
							class="active:bg-gray-100 active:scale-95 trasition-all font-title text-lg px-4 py-2 rounded-lg border border-dashed border-gray-300 flex items-center gap-2"
						>
							<img src="/back-arrow.svg" class=" w-4 h-4 inline-flex -mt-2" alt="Checkin" />
						</button>

						<button
							on:click={openFacebookShareDialog}
							class="active:bg-gray-100 active:scale-95 trasition-all font-title text-lg px-4 py-2 rounded-lg border border-dashed border-gray-300 flex items-center gap-2"
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
					class="active:bg-gray-100 active:scale-95 trasition-all font-title text-lg px-4 py-2 rounded-lg border border-dashed border-gray-300 flex items-center gap-2"
				>
					<img src="/back-arrow.svg" class=" w-4 h-4 inline-flex -mt-2" alt="Checkin" />
				</button>

				<button
					on:click={copyUrl}
					class="active:bg-gray-100 active:scale-95 trasition-all font-title text-lg px-4 py-2 rounded-lg border border-dashed border-gray-300 flex items-center gap-2"
				>
					<img src="/coffee-cup.svg" class=" w-4 h-4 inline-flex -mt-2" alt="Checkin" />
					{$t('common.shareLabel')}
				</button>
			{/if}
		</div> -->
	</div>

	<a class="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-center" href="https://mixcore.studio/">
		<div class="mb-1 mt-4 text-[15px] leading-5 flex whitespace-nowrap">Powered by</div>

		<svg
			style="color: #fc605c;
		fill: currentColor; transform: scale(1.1);"
			class=""
			xmlns="http://www.w3.org/2000/svg"
			width="171"
			height="40"
			id="svg-logo"
			viewBox="0 0 523.5 107"
			><path
				d="M138.2,28.9h13.3v6c2.1-2.3,4.7-4.2,7.6-5.5c2.9-1.2,5.9-1.8,9.1-1.8c3.2,0,6.3,0.8,9,2.4c2.7,1.6,4.8,3.9,6.4,7
			c2-2.9,4.6-5.3,7.7-7c3.1-1.6,6.5-2.4,10-2.4c3.8,0,7.1,0.9,9.9,2.6c2.7,1.6,4.9,3.9,6.2,6.7c1.2,2.8,1.9,7.3,1.9,13.5V81h-13.4
			V54.6c0-5.9-0.7-9.9-2.2-12c-1.5-2.1-3.7-3.1-6.7-3.1c-2.2,0-4.3,0.6-6.1,1.9c-1.8,1.3-3.2,3.2-4,5.3c-0.9,2.3-1.3,5.9-1.3,10.8
			V81h-13.3V55.7c0-4.7-0.3-8-1-10.1c-0.7-2.1-1.7-3.6-3.2-4.7c-1.5-1-3.2-1.6-5.1-1.5c-2.2,0-4.3,0.7-6,1.9c-1.9,1.4-3.3,3.3-4,5.4
			c-0.9,2.3-1.3,6-1.3,11V81h-13.3L138.2,28.9z"
			></path><path
				d="M237,7.4c2.3,0,4.4,0.9,6,2.5c1.6,1.6,2.5,3.8,2.5,6c0,2.2-0.9,4.4-2.5,6c-1.5,1.6-3.7,2.5-5.9,2.5c-2.3,0-4.5-0.9-6-2.5
			c-1.6-1.6-2.5-3.8-2.5-6.1c0-2.2,0.9-4.3,2.5-5.9C232.6,8.3,234.7,7.4,237,7.4z M230.4,28.9h13.3V81h-13.3V28.9z"
			></path><path
				d="M250.9,28.9h15.4l10.4,14.2l10.4-14.2h15.1l-17.9,24.5L304.6,81h-15.4l-12.6-17.1L264.1,81H249l20.1-27.4L250.9,28.9z"
			></path><path
				d="M363.1,39.4l-11,6c-2.1-2.1-4.1-3.6-6.2-4.5c-2.3-0.9-4.7-1.3-7.1-1.2c-5,0-9,1.5-12,4.4c-3.1,2.9-4.6,6.7-4.6,11.2
			c0,4.4,1.5,8,4.4,10.8c3,2.8,6.8,4.2,11.6,4.2c5.9,0,10.6-2,13.9-6l10.5,7.1c-5.7,7.3-13.7,10.9-24,10.9c-9.3,0-16.6-2.7-21.8-8.1
			c-5.3-5.4-7.9-11.8-7.9-19.1c-0.1-10,5.5-19.3,14.6-23.9c4.6-2.4,9.7-3.6,15.4-3.6c5.2,0,10,1,14.1,3.1
			C356.9,32.7,360.5,35.7,363.1,39.4z"
			></path><path
				d="M399.8,27.6c4.9,0,9.8,1.3,14.1,3.7c4.3,2.4,7.8,5.8,10.3,10c2.4,4.1,3.7,8.9,3.7,13.6c0,4.8-1.3,9.6-3.7,13.8
			c-2.4,4.2-5.9,7.7-10.1,10c-4.3,2.4-9.2,3.7-14.1,3.6c-7.6,0-14-2.7-19.4-8c-5.4-5.3-8-11.8-8-19.4c0-8.1,3-14.9,9.1-20.3
			C386.8,29.9,392.9,27.6,399.8,27.6z M400,39.9c-4.1,0-7.5,1.4-10.3,4.2c-2.7,2.8-4.1,6.4-4.1,10.8c0,4.5,1.4,8.2,4.1,11
			c2.7,2.8,6.1,4.2,10.3,4.2c4.2,0,7.6-1.4,10.4-4.2c2.8-2.8,4.1-6.5,4.1-11c0-4.5-1.4-8.1-4.1-10.9C407.7,41.3,404.3,39.9,400,39.9
			L400,39.9z"
			></path><path
				d="M435.6,28.9h11.4v6.6c1.2-2.6,2.9-4.5,4.9-5.9c2-1.3,4.3-2,6.7-2c1.9,0,3.7,0.5,5.4,1.3l-4.1,11.2
			c-1.5-0.8-2.8-1.1-3.8-1.1c-2,0-3.8,1.2-5.2,3.7c-1.4,2.5-2.1,7.4-2.1,14.6l0,2.5V81h-13.2L435.6,28.9z"
			></path><path
				d="M523.4,58.7h-42.6c0.6,3.7,2.3,6.6,4.9,8.8s6.1,3.3,10.2,3.3c4.8,0.1,9.4-1.8,12.8-5.1l11.2,5.2c-2.8,3.9-6.1,6.8-10,8.6
			c-3.9,1.9-8.5,2.8-13.8,2.8c-8.3,0-15-2.6-20.3-7.7c-5.2-5.2-7.8-11.6-7.8-19.4c0-7.9,2.6-14.5,7.8-19.8
			c5.2-5.3,11.7-7.9,19.6-7.9c8.3,0,15.1,2.6,20.3,7.9s7.8,12.2,7.8,20.8L523.4,58.7z M510.2,48.4c-0.9-2.9-2.7-5.4-5.2-7.1
			c-2.6-1.8-5.8-2.8-9-2.7c-3.5-0.1-6.9,1-9.7,3.1c-1.8,1.3-3.4,3.5-4.9,6.7H510.2z"
			></path><path d="M3.8,107V0.8h107.7V107H3.8z M9.8,100.8h95.5V6.7H9.8L9.8,100.8z"></path><path
				d="M39.4,18.7v70.1H21.9V18.7H39.4z"
			></path><path d="M48.8,18.6h17.4v70.2H48.8V18.6z"></path><path
				d="M93.1,88.9H75.7V18.7h17.4V88.9z"
			></path></svg
		>
	</a>
</Page>

<svelte:head>
	<meta property="og:title" content="Trung Nguyên E-Coffee | Hội thảo nhượng quyền" />
	<meta
		property="og:description"
		content="Trải nghiệm không gian 3 nền văn minh cà phê của Trung Nguyên E-Coffee qua màn trình diễn nghệ thuật thực cảnh đặc sắc nhất và Cùng tìm hiểu về các gói nhượng quyền phù hợp với nhu cầu tài chính của quý khách."
	/>
	<meta property="fb:app_id" content={fbAppId} />
	<meta property="fb:page_id" content={fbAppId} />
	<meta property="og:image" content={file.href} />
	<meta property="og:url" content={$page.url.href || '/banner.jpg'} />

	<meta property="og:type" content="website" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:site_name" content="Trung Nguyên E-Coffee | Hội thảo nhượng quyền" />

	<!-- Optional: Facebook App ID -->
	<meta property="fb:app_id" content={fbAppId} />
</svelte:head>

<style>
	.main-app {
		background-image: url('/background.jpg');
		background-size: cover;
		background-repeat: no-repeat;
	}
</style>
