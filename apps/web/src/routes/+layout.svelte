<script>
	import { onMount } from 'svelte';
	import '../app.scss';

	onMount(() => {
		// @ts-ignore
		window.fbAsyncInit = function () {
			// @ts-ignore
			FB.init({
				appId: '888715703203677',
				xfbml: true,
				version: 'v20.0'
			});
		};
	});
</script>

<slot />
