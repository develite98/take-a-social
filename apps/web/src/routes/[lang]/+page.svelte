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
	import { CUSTOMER_ID, DATABASE_ID } from '$lib';
	import { client } from '$lib/storage/client';
	import { locale } from '$lib/translations';
	import { Databases, ID, Query, Storage, Functions } from 'appwrite';
	import { Page } from 'konsta/svelte';
	import { onMount } from 'svelte';
	import { persisted } from 'svelte-persisted-store';

	export let lang;

	let storage!: Storage;
	let database!: Databases;
	let functions!: Functions;
	let file: File | undefined;
	let fileInput: HTMLInputElement | undefined;
	let uploading = false;
	let phone = '';
	let name = '';
	let email = '';
	let userInfo = persisted<any | null>('userData', null);
	let loading = false;

	const databaseId = '681733e5001f16726eef'; // Your database ID
	const collectionId = '68173407002237cbba6a'; // Your collection ID

	locale.set(lang);

	onMount(() => {
		client.setEndpoint('https://appwrite.4fx.vn/v1').setProject('66e3bc690017f112ad9b');

		storage = new Storage(client);
		database = new Databases(client);
		functions = new Functions(client);
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
			const user = await database.updateDocument(DATABASE_ID, CUSTOMER_ID, $userInfo.$id, {
				CheckInImagePath: [response.$id]
			});

			userInfo.set(user);
			goto(`${currentLocale}/picture/${response.$id}`);
		} catch (error) {
			//
		} finally {
			resetInput();
			uploading = false;
		}
	};

	$: currentLocale = $locale || 'vi';
	$: currentImages = ($userInfo?.CheckInImagePath as string[]) || [];

	function triggerFileInput() {
		if (currentImages?.length) {
			goto('/vi/picture/' + currentImages[0]);
		} else {
			fileInput?.click();
		}
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
			loading = true;
			const user = await database.createDocument(databaseId, collectionId, ID.unique(), {
				PhoneNumber: phone,
				Name: name || email?.toLowerCase(),
				Email: email?.toLowerCase(),
				IsCheckedIn: true
			});

			userInfo.set(user);
		} catch (error) {
			console.error('Error checking/inserting document:', error);
			alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
		}

		loading = false;
	}

	async function handleConfirm() {
		if (!email) {
			alert('Vui lòng nhập email của quý khách');
			return;
		}

		try {
			loading = true;
			const result = await database.listDocuments(databaseId, collectionId, [
				Query.equal('Email', email)
			]);

			let user;
			if (result.documents.length > 0) {
				user = result.documents[0];
				await database.updateDocument(databaseId, collectionId, user.$id, { IsCheckedIn: true });
			} else {
				user = await database.createDocument(databaseId, collectionId, ID.unique(), {
					IsCheckedIn: true,
					Email: email
				});
			}

			userInfo.set(user);
			if (user) {
				// const promise = functions.createExecution(
				// 	'check-customer-email', // functionId
				// 	'<BODY>', // body (optional)
				// 	false, // async (optional)
				// 	'<PATH>', // path (optional)
				// 	'GET', // method (optional)
				// 	{} // headers (optional)
				// );
			}
		} catch (error) {
			console.error('Error checking/inserting document:', error);
			alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
		}

		loading = false;
	}
</script>

<Page style="background: rgb(5 5 60)">
	<div class="w-full h-full min-h-[100dvh] flex flex-col main-app max-w-2xl mx-auto mx-auto pb-44 overflow-auto">
		<!-- <div class="flex px-4 pb-4 pt-[8vh] justify-center">
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
		</div> -->
		<div class="mb-4 pt-12 flex w-full justify-center">
			<img class="w-[88%] h-auto" alt="4Fx" src="header.svg" />
		</div>
		<div class="p-4 px-16">
			{#if !$userInfo}
				<div class="w-full max-w-sm mx-auto min-w-[200px]">
					<input
						bind:value={email}
						class="w-full bg-transparent placeholder:text-slate-200 text-slate-200 text-sm border border-slate-200 rounded-md px-4 py-3 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
						placeholder="Nhập email..."
					/>
				</div>

				<div class="flex items-center justify-center mt-4 w-full">
					<button
						on:click={handleConfirm}
						type="button"
						class:disabled={loading}
						class="py-3 bg-[#00CCFF] flex gap-2 items-center px-12 me-2 mb-2 text-base font-medium text-gray-900 rounded-lg"
					>
						{#if loading}
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
						Xác nhận
					</button>
				</div>
			{:else}
				<input
					type="file"
					id="uploader"
					accept="image/*"
					bind:this={fileInput}
					on:change={handleFileChange}
					style="display: none;"
				/>

				{#if !$userInfo.Name}
					<div class="text-center text-lg text-white">
						Xin chào, <br />
						<span class="text-2xl">
							{$userInfo?.Email.split('@')[0] || 'Guest'}
						</span> <br />

						<a class="text-xs text-blue-500" on:click={() => userInfo.set(null)}>Đổi email</a>
					</div>
					<div class="text-center mt-2 text-white text-sm mb-4">Thêm 1 bước để nhận thưởng</div>
					<div class="w-full max-w-sm min-w-[200px] mb-2">
						<input
							bind:value={name}
							class="w-full bg-transparent placeholder:text-slate-200 text-slate-200 text-sm border border-slate-200 rounded-md px-4 py-3 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
							placeholder="Nhập họ và tên..."
						/>
					</div>

					<div class="w-full max-w-sm min-w-[200px] mb-2">
						<input
							bind:value={phone}
							class="w-full bg-transparent placeholder:text-slate-200 text-slate-200 text-sm border border-slate-200 rounded-md px-4 py-3 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
							placeholder="Nhập số điện thoại..."
						/>
					</div>

					<div class="flex items-center justify-center mt-4 w-full">
						<button
							on:click={handleInsertInfo}
							type="button"
							class:disabled={loading}
							class="py-3 bg-[#00CCFF] flex items-center gap-2 px-12 me-2 mb-2 text-base font-medium text-gray-900 rounded-lg"
						>
							{#if loading}
								<div class="text-left rtl:text-right">
									<div role="status">
										<svg
											aria-hidden="true"
											class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
												fill="currentFill"
											/>
										</svg>
										<span class="sr-only">Loading...</span>
									</div>
								</div>
							{/if}
							Xác nhận
						</button>
					</div>
				{:else}
					<div class="text-center text-lg text-white">
						Xin chào, <br />
						<span class="text-2xl">
							{$userInfo?.Name || 'Guest'}
						</span> <br />

						<a class="text-xs text-blue-500" on:click={() => userInfo.set(null)}>Đổi tài khoản</a>
					</div>

					<div class="flex flex-col gap-4 justify-center mt-6">
						<button
							class:opacity-60={uploading}
							class:pointer-events-none={uploading}
							on:click={() => triggerFileInput()}
							class="text-white active:scale-95 trasition-all font-title text-sm px-4 py-6 pt-5 rounded-lg border border-dashed border-gray-300 flex flex-col justify-center items-center gap-2"
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

							{#if currentImages?.length}
								<div>📷 Xem lại hình ảnh</div>
							{:else}
								<div>
									📷 Chia sẽ hình ảnh <br /> Check-in sự kiện
								</div>
							{/if}
						</button>

						<button
							class:opacity-60={uploading}
							class:pointer-events-none={uploading}
							on:click={() => goto('/vi/register')}
							class="text-white active:scale-95 trasition-all font-title text-sm px-4 py-6 pt-5 rounded-lg border border-dashed border-gray-300 flex flex-col justify-center items-center gap-2"
						>
							<div>🎉 Đăng ký Buổi Tiệc Offline 4FX <br> Kết Nối Nhà Giao Dịch!</div>
						</button>
					</div>
				{/if}
			{/if}
		</div>

		<div class="mt-12 w-full flex flex-col items-center">
			<img class="w-[60%] max-w-[300px] h-auto" alt="4Fx" src="footer-text.svg" />
		</div>
	</div>


</Page>

<svelte:head>
	<meta property="og:title" content="4FX | HCMC Volume Trading" />
	<meta property="og:description" content="Cảm ơn quý khách" />

	<meta property="og:url" content={$page.url.href} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:site_name" content="4FX | HCMC Volume Trading" />
</svelte:head>

<style>
	.main-app {
		background-image: url('/bg.png');
		background-size: cover;
		background-repeat: no-repeat;
	}

	.disabled {
		opacity: 0.6;
		pointer-events: none;
	}
</style>
