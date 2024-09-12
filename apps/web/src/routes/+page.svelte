<script>
	import { goto } from '$app/navigation';
	import { Block, Button, Fab, Navbar, Page } from 'konsta/svelte';

	const fbAppId = '1496238194355915'  // URL to share
    const shareUrl = "https://trungnguyenlegend.com";
	const message = "This is a post with #hashtag1 #hashtag2";
    // URL to redirect after share
    const redirectUrl = "https://yourwebsite.com/thank-you";

	function openFacebookShareDialog() {
        const shareDialogUrl = `https://www.facebook.com/dialog/share?app_id=${fbAppId}?&hashtag=${encodeURIComponent('#hastag1 #hastag2')}&display=page&quote=${encodeURIComponent(message)}&href=${encodeURIComponent(shareUrl)}&redirect_uri=${encodeURIComponent(redirectUrl)}`;

        // Open the Facebook share dialog in a new window
        window.open(shareDialogUrl, '_blank', 'width=600,height=400');
    }
</script>

<Page>
	<Navbar title="Mix Social App" />

	<Block strong>
		<p>#hastag1, #hastag2</p>
	</Block>

	<Fab class="fixed left-1/2 bottom-4-safe -translate-x-1/2" text="Take a Screenshot" onClick={() => goto('/picture')}></Fab>
</Page>
