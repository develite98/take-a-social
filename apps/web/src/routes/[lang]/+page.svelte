<script context="module">
	// @ts-ignore
	export const load = ({ params }) => {
		return {
			lang: params.lang
		};
	};
</script>

<script lang="ts">
	import { locale, _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { Page, SegmentedButton, Segmented } from 'konsta/svelte';
	import { onMount } from 'svelte';
	import { client } from '$lib/storage/client';
	import { Storage, ID } from 'appwrite';

	export let lang;
	let activeSegmented = 1;
	let storage!: Storage;
	let file: File | undefined; // Variable to hold the selected file
	let fileInput: HTMLInputElement | undefined; // Reference to the file input element
	let uploading = false; // To show loading state during upload

	locale.set(lang);

	onMount(() => {
		console.log(client);
		storage = new Storage(client);
	});

	const upload = async () => {
		if (!file) {
			alert('Please select a file first!');
			return;
		}

		try {
			uploading = true;
			const promise = storage.createFile('66e3be700038d5567aa5', ID.unique(), file);
			const response = await promise;
			goto(`${currentLocale}/picture/${response.$id}`);
		} catch (error) {
			//
		} finally {
			resetInput();
			uploading = false;
		}
	};

	$: currentLocale = $locale || 'vi';

	function triggerFileInput() {
		fileInput?.click(); // Programmatically trigger the hidden file input
	}

	function handleFileChange(event: any) {
		file = event.target.files[0]; // Set the selected file
		upload(); // Automatically upload the file after selection
	}

	function resetInput() {
		if (!fileInput) return;

		fileInput.value = ''; // Clear the file input element
		file = undefined; // Reset the file variable
	}
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
			Viện Hàn Lâm Vỉa Hè <br /> Cộng Đồng ba nền văn minh cà phê <br /> Tinh hoa hội tụ
		</div>

		<div class="leading-5 text-center mt-2 px-4 italic">
			TP Hồ Chí Minh, 14/09/2024
		</div>

		<input
			type="file"
			id="uploader"
			accept="image/*"
			bind:this={fileInput}
			on:change={handleFileChange}
			style="display: none;"
		/>

		<div class="flex justify-center mt-6">
			<button
				class:opacity-60={uploading}
				class:pointer-events-none={uploading}
				on:click={() => triggerFileInput()}
				class="active:bg-gray-100 active:scale-95 trasition-all font-title text-lg px-4 py-2 rounded-lg border border-dashed border-gray-300 flex items-center gap-2"
			>
				{#if uploading}
					<svg
						aria-hidden="true"
						role="status"
						class="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600 -mt-2"
						viewBox="0 0 100 101"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
							fill="currentColor"
						/>
						<path
							d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
							fill="#1C64F2"
						/>
					</svg>
				{:else}
					<img src="coffee-cup.svg" class=" w-4 h-4 inline-flex -mt-2" alt="Checkin" />
				{/if}

				Checkin
			</button>
		</div>
	</div>

	<div class="fixed bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
		<Segmented strong rounded>
			<SegmentedButton
				strong
				style="height: 1.75rem;"
				rounded
				active={activeSegmented === 1}
				onClick={() => locale.set('vi')}
			>
				<span class="whitespace-nowrap text-xs">Tiếng Việt</span>
			</SegmentedButton>
			<SegmentedButton
				strong
				style="height: 1.75rem;"
				rounded
				active={activeSegmented === 3}
				onClick={() => locale.set('en')}
			>
				<span class="whitespace-nowrap text-xs">English</span>
			</SegmentedButton>
		</Segmented>

		<div class="text-center mt-2">Developed By Mixcore.Studio</div>
	</div>
</Page>

<svelte:head>
	<meta property="og:title" content="Trung Nguyên Legend | Hội thảo nhượng quyền" />
	<meta property="og:description" content="Cảm ơn quý khách" />

	<meta property="og:url" content="https://trungnguyenlegend.com" />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:site_name" content="Your Website Name" />
</svelte:head>

<style>
	.main-app {
		background-image: url('/background.jpg');
		background-size: cover;
		background-repeat: no-repeat;
	}
</style>
