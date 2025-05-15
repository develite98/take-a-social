<script>
	import { onMount } from 'svelte';
	import '../../app.scss';
	import { client } from '$lib/storage/client';

	let appActive = false;

	client
		.setEndpoint('https://appwrite.4fx.vn/v1')
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
	});
</script>

<slot></slot>