<script context="module">
	// @ts-ignore
	export const load = ({ params }) => {
	  return {
		lang: params.lang
	  };
	};
  </script>

<script>
	import { locale, _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { Page, SegmentedButton, Segmented } from 'konsta/svelte';

	export let lang;
	let activeSegmented = 1;
	locale.set(lang);

	$: currentLocale = $locale || 'vi';
</script>

<Page>
	<div class="w-full h-full main-app max-w-96 mx-auto">
		<div class="flex px-4 pb-4 pt-[8vh] justify-center">
			<img src="/logo.png" alt="Trung Nguyên Legend" />
		</div>
		<h2 class="font-title text-lg text-center px-6 mt-2 text-[#42201A]">
			{'Hội thảo nhượng quyền'} <br /> {'Trung Nguyên E-Coffee'}
		</h2>

		<div class="leading-5 text-center mt-2 px-4 italic">
			“Không chỉ là những ly cà phê năng lượng tuyệt hảo, <br /> nơi đây còn là những giấc mơ.”
		</div>

		<div class="flex justify-center mt-6">
			<button on:click={() => goto(`${currentLocale}/picture`)} class="active:bg-gray-100 active:scale-95 trasition-all font-title text-lg px-4 py-2 rounded-lg border border-dashed border-gray-300 flex items-center gap-2">
				<img src="coffee-cup.svg" class=" w-4 h-4 inline-flex -mt-2" alt="Checkin">
				Checkin
			</button>
		</div>
	</div>

	<div class="fixed bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
		<Segmented strong rounded>
			<SegmentedButton
			  strong style="height: 1.75rem;"
			  rounded
			  active={activeSegmented === 1}
			  onClick={() => locale.set('vi')}
			>
			<span class="whitespace-nowrap text-xs">Tiếng Việt</span>
			</SegmentedButton>
			<SegmentedButton
			  strong style="height: 1.75rem;"
			  rounded
			  active={activeSegmented === 3}
			  onClick={() => locale.set('en')}
			>
			<span class="whitespace-nowrap text-xs">English</span>
			</SegmentedButton>
		  </Segmented>

		  <div class="text-center mt-2">
			  Developed By Mixcore.Studio
		  </div>
	</div>
</Page>

<style>
	.main-app {
		background-image: url('/background.jpg');
		background-size: cover;
		background-repeat: no-repeat;
	}
</style>
