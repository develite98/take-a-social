<script lang="ts">
	import { goto } from '$app/navigation';
	import { CUSTOMER_ID, DATABASE_ID } from '$lib';
	import { client } from '$lib/storage/client';
	import { Databases, ID, Storage } from 'appwrite';
	import {
		Page,
		Navbar,
		BlockTitle,
		Block,
		Button,
		NavbarBackLink,
		List,
		ListItem
	} from 'konsta/svelte';
	import { onMount } from 'svelte';
	import { persisted } from 'svelte-persisted-store';

	let userInfo = persisted<any | null>('userData', null);

	let isTop = false;
	let storage!: Storage;
	let database!: Databases;

	let file: File | undefined;
	let fileInput: HTMLInputElement | undefined;
	let uploading = false;

	$: currentImages = ($userInfo?.RegisterPartyImagePath as string[]) || [];

	onMount(() => {
		client.setEndpoint('https://appwrite.4fx.vn/v1').setProject('66e3bc690017f112ad9b');

		storage = new Storage(client);
		database = new Databases(client);
	});

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
				RegisterPartyImagePath: [...($userInfo?.RegisterPartyImagePath || []), response.$id]
			});

			userInfo.set(user);
		} catch (error) {
			//
		} finally {
			resetInput();
			uploading = false;
		}
	};
</script>

<Page>
	<div class="w-full h-full main-app max-w-2xl mx-auto mx-auto">
		<Navbar title="Đăng ký tiệc Offline">
			<NavbarBackLink slot="left" text="Back" onClick={() => history.back()} />
		</Navbar>
		<BlockTitle class="text-center w-fit mx-auto">Thông tin ngân hàng</BlockTitle>
		<Block>
			<img
				class="w-full max-w-[440px] mx-auto rounded border"
				src="/qr-code.jpg"
				alt="Mã chuyển khoản"
			/>
		</Block>
		<Block strongIos outlineIos class="space-y-4">
			<p>Quý khách vui lòng chuyển khoản theo mã trên và đính kèm ảnh chụp màn hình lại đây</p>
			<p>Có thể đính kèm nhiều hình ảnh</p>

			<p>
				<Button disabled={uploading} onClick={() => triggerFileInput()}>
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
					Tải hình ảnh
				</Button>
			</p>
		</Block>

		<BlockTitle>Ảnh đã đính kèm:</BlockTitle>
		<Block>
            {#each currentImages as imageId (imageId)}
					{#await storage?.getFilePreview('66e3be700038d5567aa5', imageId)}
						<!-- promise is pending -->
						<p>Loading...</p>
					{:then value}
						<!-- promise was fulfilled or not a Promise -->
						<!-- svelte-ignore a11y-img-redundant-alt -->
						<img class="w-full mb-4 rounded shadow border" alt="Image" src={value?.href} />
					{:catch error}
						<!-- promise was rejected -->
						<p>Something went wrong</p>
					{/await}
			{/each}
        </Block>

		<input
			type="file"
			id="uploader"
			accept="image/*"
			bind:this={fileInput}
			on:change={handleFileChange}
			style="display: none;"
		/>
	</div>
</Page>
