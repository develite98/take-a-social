<script lang="ts">
	import { goto } from '$app/navigation';
	import { Page } from 'konsta/svelte';
	import { locale, _ } from 'svelte-i18n';
	import { client } from '$lib/storage/client';
	import { Storage } from 'appwrite';
	import { page } from '$app/stores';

	const fbAppId = '888715703203677';
	const hashtags = '#TrungNguyenEcoffee#3nenVanMinhCaPhe#TinhHoaHoiTu';
	const storage: Storage = new Storage(client);
	const file = storage.getFilePreview('66e3be700038d5567aa5', $page.params.id) || undefined;

	function goBack() {
		goto(`/${currentLocale}`);
	}

	function openFacebookShareDialog() {
		const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
		const shareUrl = window.location.href;

		const fpShareUrl = `https://www.facebook.com/dialog/share?
					app_id=${fbAppId}
					&display=page
					&href=${encodeURIComponent(shareUrl)}
					&quote=${encodeURIComponent(hashtags)}
					&hashtag=${encodeURIComponent(hashtags)}
					&redirect_uri=${encodeURIComponent(shareUrl)}`

		window.open(fpShareUrl, '_self');

		// if (isMobile) {
		// 	// Attempt to open Facebook's native app with the share dialog
		// 	const fbAppUrl = `fb://faceweb/f?href=https://m.facebook.com/sharer.php?u=${encodeURIComponent(shareUrl)}&hashtag=${encodeURIComponent(hashtags)}&quote=${encodeURIComponent(hashtags)}`;
		// 	// Try opening the Facebook app
		// 	window.open(fbAppUrl);
		// } else {
			// @ts-ignore
			// FB.ui(
			// 	{
			// 		method: 'share',
			// 		href: shareUrl,
			// 		hashtag: hashtags,
			// 		quote: hashtags
			// 		// @ts-ignore
			// 	},
			// 	// @ts-ignore
			// 	function (response) {
			// 		console.log(response);
			// 	}
			// );
		// }
	}

	$: currentLocale = $locale || 'vi';
</script>

<Page>
	<div class="w-full h-full main-app max-w-96">
		<div class="flex px-4 pb-4 pt-[8vh] justify-center">
			<img class="w-[120px]" src="/logo.png" alt="Trung Nguyên E-Coffee" />
		</div>

		<h2 class="font-title text-lg text-center px-6 mt-2 text-[#42201A]">
			Hội thảo nhượng quyền <br /> Trung Nguyên E-Coffee
		</h2>

		<div class="p-2 m-4 rounded-lg border border-dashed border-gray-300 h-[30vh]">
			<img
				class="rounded-lg h-full w-full object-cover"
				src={file?.href || 'https://images6.alphacoders.com/134/1348908.jpeg'}
				alt=""
			/>
		</div>

		<div class="flex justify-center w-3/4 text-center mx-auto leading-2" style="line-height: 1.5;">
			{hashtags.split(' ').join(', ')}
		</div>

		<div class="flex justify-center mt-4 gap-2">
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
				<img src="/coffee-cup.svg" class=" w-4 h-4 inline-flex -mt-2" alt="Checkin" />
				Chia sẻ Fb
			</button>
		</div>
	</div>
</Page>

<svelte:head>
	<meta property="og:title" content="Trung Nguyên E-Coffee | Hội thảo nhượng quyền" />
	<meta property="og:description" content="Cảm ơn quý khách" />
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
