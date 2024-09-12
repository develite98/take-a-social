<script>
	import { goto } from '$app/navigation';
	import { Block, Fab, Page } from 'konsta/svelte';

	const fbAppId = '1496238194355915'; // URL to share
	const message = 'This is a post with #hashtag1 #hashtag2';
	// URL to redirect after share

	function openFacebookShareDialog() {
		const shareUrl = window.location.href;
		const redirectUrl = window.location.href;

		const shareDialogUrl = `https://www.facebook.com/dialog/share?app_id=${fbAppId}?&hashtag=${encodeURIComponent('#hastag1 #hastag2')}&display=page&quote=${encodeURIComponent(message)}&href=${encodeURIComponent(shareUrl)}&redirect_uri=${encodeURIComponent(redirectUrl)}`;

		// Open the Facebook share dialog in a new window
		window.open(shareDialogUrl, '_blank', 'width=600,height=400');
	}
</script>

<Page>
	<div class="p-4 pt-12">
		<img class="rounded-lg" src={'meeting-wallpaper.jpg'} alt="" />
	</div>

	<Block strong>
		<p>#hastag1, #hastag2</p>

		<div class="mt-4 text-xl">Thank you very much</div>
	</Block>

	<Fab
		style="bottom: 5rem"
		class="fixed left-1/2 -translate-x-1/2 z-20 bg-primary text-white"
		text="Share to facebook"
		onClick={openFacebookShareDialog}
	></Fab>
	<Fab
		onClick={() => goto('/')}
		class="fixed left-1/2 -translate-x-1/2 bottom-4-safe z-20"
		text="Take another picture"
	></Fab>
</Page>

<svelte:head>
	<meta property="og:title" content="Your Page Title" />
	<meta property="og:description" content="This is a description for the shared content." />
	<meta
		property="og:image"
		content="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScgb8ukaN02C--nk6x4kriWfkpStKaTnQdQA&s"
	/>
	<meta property="og:url" content="https://trungnguyenlegend.com" />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:site_name" content="Your Website Name" />

	<!-- Optional: Facebook App ID -->
	<meta property="fb:app_id" content={fbAppId} />
</svelte:head>
