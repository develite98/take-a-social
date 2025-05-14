<script context="module">
	// @ts-ignore
	export const load = ({ params }) => {
		return {
			lang: params.lang
		};
	};
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { client } from '$lib/storage/client';
	import { locale, t } from '$lib/translations';
	import { Databases, ID, Query, Storage } from 'appwrite';
	import { Button, List, ListInput, Page } from 'konsta/svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export let lang;

	let storage!: Storage;
	let database!: Databases;
	let file: File | undefined;
	let fileInput: HTMLInputElement | undefined;
	let uploading = false;
	let phone = '';
	let name = '';
	let email = '';
	let userInfo = writable<any | null>(null);
	let showInputName = false;

	const databaseId = '681733e5001f16726eef'; // Your database ID
	const collectionId = '68173407002237cbba6a'; // Your collection ID

	locale.set(lang);

	onMount(() => {
		storage = new Storage(client);
		client.setEndpoint('https://appwrite.4fx.vn/v1').setProject('66e3bc690017f112ad9b');

		database = new Databases(client);
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
		fileInput?.click();
	}

	function handleFileChange(event: any) {
		file = event.target.files[0];
		upload();
	}

	function resetInput() {
		if (!fileInput) return;

		fileInput.value = '';
		file = undefined;
	}

	async function handleInsertInfo() {
		if (!name) {
			alert('Vui lòng nhập họ và tên');
			return;
		}

		try {
			const user = await database.createDocument(databaseId, collectionId, ID.unique(), {
				PhoneNumber: phone,
				Name: name,
				Email: email,
			});

			userInfo.set(user);
		} catch (error) {
			console.error('Error checking/inserting document:', error);
			alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
		}
	}

	async function handleConfirm() {
		if (!phone) {
			alert('Vui lòng nhập số điện thoại');
			return;
		}

		try {
			const result = await database.listDocuments(databaseId, collectionId, [
				Query.equal('PhoneNumber', phone)
			]);

			if (result.documents.length > 0) {
				userInfo.set(result.documents[0]);
			} else {
				showInputName = true;
			}
		} catch (error) {
			console.error('Error checking/inserting document:', error);
			alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
		}
	}
</script>

<Page>
	<div class="w-full h-full main-app max-w-2xl mx-auto mx-auto">
		<div class="flex px-4 pb-4 pt-[8vh] justify-center">
			<img class="w-[80px]" src="/logo.png" alt="Trung Nguyên E-Coffee" />
		</div>
		<h2 class="font-title text-2xl text-center px-6 mt-2">
			<div class="text-6xl">
				{$t('common.title')}
			</div>
			VOLUME TRADING
		</h2>

		<div
			class="leading-5 text-center mt-4 px-4 rounded-full border border-base-content/10 w-fit py-2 mx-auto"
		>
			Hành trình nhất quán trong giao dịch
		</div>
		{#if !$userInfo}
			{#if showInputName}

				<List strongIos insetIos>
					<div class="mb-4 mx-4 text-center">
						Hoàn thành thêm 1 bước để nhận nhiều phần quá hấp dẫn
					</div>

					<ListInput
						value={name}
						onChange={(e) => (name = e.target.value)}
						outline
						label="Họ và tên"
						type="text"
						placeholder="Nhập họ và tên của quý khách"
					></ListInput>

					<ListInput
						value={email}
						onChange={(e) => (email = e.target.value)}
						outline
						label="Email"
						type="text"
						placeholder="Nhập email của quý khách"
					></ListInput>


					<div class="flex justify-center w-[160px] m-auto">
						<Button onClick={() => handleInsertInfo()} class="text-base" large rounded
							>Xác nhận</Button
						>
					</div>
				</List>
			{:else}
				<List strongIos insetIos>
					<ListInput
						value={phone}
						onChange={(e) => (phone = e.target.value)}
						outline
						label="Số điện thoại"
						type="text"
						placeholder="Nhập số điện thoại của quý khách"
					></ListInput>

					<div class="flex justify-center w-[160px] m-auto">
						<Button onClick={handleConfirm} class="text-base" large rounded>Xác nhận</Button>
					</div>
				</List>
			{/if}
		{:else}
			<input
				type="file"
				id="uploader"
				accept="image/*"
				bind:this={fileInput}
				on:change={handleFileChange}
				style="display: none;"
			/>

			<div class="text-center mt-6 text-base">Xin chào, {$userInfo?.Name}</div>

			<div class="flex justify-center mt-4">
				<button
					class:opacity-60={uploading}
					class:pointer-events-none={uploading}
					on:click={() => triggerFileInput()}
					class="bg-white active:bg-gray-100 active:scale-95 trasition-all font-title text-sm px-4 py-6 pt-5 rounded-lg border border-dashed border-gray-300 flex flex-col justify-center items-center gap-2"
				>
					{#if uploading}
						<svg
							aria-hidden="true"
							role="status"
							class="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
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
					{/if}
					<div>
						Chọn ảnh đẹp của bạn <br /> tại đây
					</div>
				</button>
			</div>
		{/if}
	</div>

	<div class="fixed bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
		<div class=" mt-4 mb-2 text-[12px] leading-5 flex text-center">
			#MarketBalance, #4FxTeam, #TradingCoffee
		</div>
	</div>
</Page>

<svelte:head>
	<meta property="og:title" content="Trung Nguyên E-Coffee | Hội thảo nhượng quyền" />
	<meta property="og:description" content="Cảm ơn quý khách" />

	<meta property="og:url" content={$page.url.href} />
	<meta property="og:image" content="/banner.jpg" />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:site_name" content="Trung Nguyên E-Coffee" />
</svelte:head>

<style>
	.main-app {
		background-image: url('/background.jpg');
		background-size: cover;
		background-repeat: no-repeat;
	}
</style>
