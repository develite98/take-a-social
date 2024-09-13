<script>
	import { onMount } from 'svelte';
	import '../../app.scss';
	import { isLoading } from 'svelte-i18n'

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


{#if !$isLoading}
<div class="max-w-96">
	<slot />
</div>
{/if}

