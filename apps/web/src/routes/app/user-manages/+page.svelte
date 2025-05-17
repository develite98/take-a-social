<script lang="ts">
	import { onMount } from 'svelte';
	import { client } from '$lib/storage/client';
	import { Databases, ID, Query, type Models, Storage } from 'appwrite';
	import { DATABASE_ID, CUSTOMER_ID, GAME_ID } from '$lib';

	type User = {
		$id: string;
		Name: string;
		Email: string;
		RegisterPartyImagePath: string[];
		IsPartyApproved: boolean;
		AlreadyWin: boolean;
		PhoneNumber: string;
		Type: string;
		VolumeLots: number;
		IsCheckedIn: boolean;
		WillWin: boolean;
	};

	type GameRoom = {
		Name: string;
		$id: string;
		customer: User[];
	};

	let database!: Databases;

	// Sample initial users in each column
	let leftUsers: User[] = [];
	let rightUsers: User[] = [];
	let gameRooms: GameRoom[];
	let selectedGameRoom: GameRoom | undefined = undefined;
	let searchText = '';
	let types = ['Guest', 'Trial', 'Premier'];
	let selectedTypes: string[] = [];
	let isCheckedIn: boolean = false;
	let isApproved: boolean = false;
	let storage: Storage;

	// Transfer user from one list to the other
	async function addUserToRoom(user: User) {
		if (!selectedGameRoom) return;

		leftUsers = [...leftUsers, user];
		await database.updateDocument(DATABASE_ID, GAME_ID, selectedGameRoom?.$id, {
			...clean(selectedGameRoom),
			customer: leftUsers.map((u) => clean(u))
		});
	}

	async function removeUserFromRoom(user: User) {
		if (!selectedGameRoom) return;

		leftUsers = leftUsers.filter((x) => x.$id !== user.$id);
		await database.updateDocument(DATABASE_ID, GAME_ID, selectedGameRoom?.$id, {
			...clean(selectedGameRoom),
			customer: leftUsers.map((u) => clean(u))
		});
	}

	function clean<T>(value: T): T {
		const result = JSON.parse(JSON.stringify(value)) as Models.Document;
		delete (result as any).$databaseId;
		delete (result as any).$permissions;
		delete (result as any).$collectionId;

		return result as unknown as T;
	}

	async function fetGameRooms() {
		try {
			const response = await database.listDocuments(DATABASE_ID, GAME_ID);
			gameRooms = response.documents as unknown as GameRoom[];
			selectedGameRoom = gameRooms[0];
		} catch (error) {
			console.error('Error fetching Customer documents:', error);
			gameRooms = [];
		}
	}

	async function fetchCustomers() {
		try {
			const response = await database.listDocuments(DATABASE_ID, CUSTOMER_ID, [Query.limit(500)]);
			rightUsers = response.documents as unknown as User[];
		} catch (error) {
			rightUsers = [];
		}
	}

	function filter(
		data: User[],
		searchText: string,
		type: string[],
		isChecked: boolean,
		isApproved: boolean
	) {
		let result = data;
		result = result.filter((x) => x.Name.includes(searchText || ''));

		if (type?.length) {
			result = result.filter((x) => type.includes(x.Type));
		}

		if (isChecked) {
			result = result.filter((x) => x.IsCheckedIn);
		}

		if (isApproved) {
			result = result.filter((x) => x.IsPartyApproved);
		}

		return result;
	}

	function openImagePreview(id: string) {
		const url = storage.getFilePreview('66e3be700038d5567aa5', id);
		window.open(url, '_blank');
	}

	async function handleApprove(event: Event, user: User) {
		const target = event.target as HTMLInputElement;
		const checked = target.checked;
		user.IsPartyApproved = target.checked;
		await database.updateDocument(DATABASE_ID, CUSTOMER_ID, user.$id, { IsPartyApproved: checked });
	}

	async function handleAlreadyWin(event: Event, user: User) {
		const target = event.target as HTMLInputElement;
		const checked = target.checked;
		user.AlreadyWin = true;
		await database.updateDocument(DATABASE_ID, CUSTOMER_ID, user.$id, { AlreadyWin: checked });
	}

	async function handleWillWin(event: Event, user: User) {
		const target = event.target as HTMLInputElement;
		const checked = target.checked;
		user.WillWin = true;
		await database.updateDocument(DATABASE_ID, CUSTOMER_ID, user.$id, { WillWin: checked });
	}

	onMount(() => {
		client.setEndpoint('https://appwrite.4fx.vn/v1').setProject('66e3bc690017f112ad9b');
		database = new Databases(client);
		storage = new Storage(client);

		fetGameRooms();
		fetchCustomers();
	});

	$: {
		if (selectedGameRoom) {
			leftUsers = selectedGameRoom.customer || [];
		}
	}

	$: displayRightUsers = filter(rightUsers, searchText, selectedTypes, isCheckedIn, isApproved);
</script>

<div class="bg-gray-50 min-h-screen p-6 flex flex-col items-center font-sans">
	<div class="w-full max-w-7xl">
		<div class="mb-4 flex justify-center flex-col items-center"></div>
		<div class="flex flex-col md:flex-row gap-8 mb-8">
			<div class="flex-1 bg-white rounded-lg shadow p-6">
				<h2 class="text-xl font-semibold mb-4 text-indigo-700">Danh sách khách hàng</h2>

				<form class="mb-2">
					<div class="relative">
						<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
							<svg
								class="w-4 h-4 text-gray-500 dark:text-gray-400"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 20 20"
							>
								<path
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
								/>
							</svg>
						</div>
						<input
							type="search"
							id="search"
							bind:value={searchText}
							class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="Search name or phone number"
							required
						/>
					</div>
				</form>

				<div class="flex gap-2 mb-4">
					<div class="me-2 pe-4 border-r">
						{#if isCheckedIn}
							<button
								on:click={() => (isCheckedIn = false)}
								class="rounded-md bg-slate-800 py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm"
							>
								Checked in
							</button>
						{:else}
							<button
								on:click={() => (isCheckedIn = true)}
								class="rounded-md border border-slate-300 py-0.5 px-2.5 text-center text-sm transition-all shadow-sm text-slate-600"
							>
								Checked in
							</button>
						{/if}
					</div>

					<div class="me-2 pe-4 border-r">
						{#if isApproved}
							<button
								on:click={() => (isApproved = false)}
								class="rounded-md bg-slate-800 py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm"
							>
								Party approved
							</button>
						{:else}
							<button
								on:click={() => (isApproved = true)}
								class="rounded-md border border-slate-300 py-0.5 px-2.5 text-center text-sm transition-all shadow-sm text-slate-600"
							>
								Party approved
							</button>
						{/if}
					</div>

					{#each types as type}
						{#if selectedTypes?.includes(type)}
							<button
								on:click={() => (selectedTypes = selectedTypes.filter((x) => x !== type))}
								class="rounded-md bg-gradient-to-tr from-slate-800 to-slate-700 py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm"
							>
								{type}
							</button>
						{:else}
							<button
								on:click={() => (selectedTypes = selectedTypes.concat(type))}
								class="rounded-md border border-slate-300 py-0.5 px-2.5 text-center text-sm transition-all shadow-sm text-slate-600"
							>
								{type}
							</button>
						{/if}
					{/each}
				</div>

				<div class="mb-2 font-bold mx-4">Đã tìm thấy {displayRightUsers?.length} khách hàng</div>

				<div class="relative overflow-auto max-h-[70vh]">
					<table
						class="w-full border mt-2 rounded-lg overflow-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
					>
						<thead
							class="sticky top-0 z-20 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
						>
							<tr>
								<th scope="col" class="px-6 py-3"> Thông tin </th>
								<th scope="col" class="px-6 py-3"> Sđt </th>
								<th scope="col" class="px-6 py-3"> Checkin </th>
								<th scope="col" class="px-6 py-3"> Khối lượng GD </th>
								<th scope="col" class="px-6 py-3"> Loại khách hàng </th>
								<th scope="col" class="px-6 py-3"> Tiệc Offline </th>
								<th scope="col" class="px-6 py-3"> Đã thắng </th>
								<th scope="col" class="px-6 py-3"> Next </th>
							</tr>
						</thead>

						<tbody>
							{#each displayRightUsers as user}
								<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
									<th class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
										<div>
											<div class="font-bold">{user.Name}</div>
											<div class="text-sm opacity-80">{user.Email || 'N/A'}</div>
										</div>
									</th>
									<td class="px-6 py-4"> {user.PhoneNumber} </td>
									<td class="px-6 py-4">
										<div class="flex items-center mb-4">
											<input
												id="default-checkbox"
												type="checkbox"
												checked={user.IsCheckedIn}
												class="pointer-events-none w-5 h-5 rounded-lg text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
											/>
										</div>
									</td>
									<td class="px-6 py-4"> {user.VolumeLots || 'N/A'} </td>
									<td class="px-6 py-4">
										{#if user.Type === 'Trial'}
											<span
												class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset"
												>Trial
											</span>
										{:else if user.Type === 'Premier'}
											<span
												class="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-pink-700/10 ring-inset"
												>Premier
											</span>
										{:else}
											<span
												class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset"
												>Guest
											</span>
										{/if}
									</td>
									<td class="px-6 py-4">
										<div>
											<div class="font-bold mb-2">
												<ul>
													{#each user.RegisterPartyImagePath as file}
														<li class="text-sm text-primary cursor-pointer">
															- <a on:click={() => openImagePreview(file)}>Xem hình ảnh</a>
														</li>
													{/each}
												</ul>
											</div>
											<div class="text-sm opacity-80">
												<div class="flex items-center mb-4">
													<input
														id="default-checkbox-{user.$id}"
														type="checkbox"
														checked={user.IsPartyApproved}
														on:change={(e) => handleApprove(e, user)}
														class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
													/>
													<label
														for="default-checkbox-{user.$id}"
														class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
														>Duyệt</label
													>
												</div>
											</div>
										</div>
									</td>
									<td class="px-6 py-4">
										<div class="text-sm opacity-80">
											<div class="flex items-center mb-4">
												<input
													id="already-win-checkbox-{user.$id}"
													type="checkbox"
													checked={user.AlreadyWin}
													on:change={(e) => handleAlreadyWin(e, user)}
													class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
												/>
												<label
													for="already-win-checkbox-{user.$id}"
													class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
													>Đã thắng</label
												>
											</div>
										</div>
									</td>
									<td class="px-6 py-4">
										<div class="text-sm opacity-80">
											<div class="flex items-center mb-4">
												<input
													id="will-win-checkbox-{user.$id}"
													type="checkbox"
													checked={user.WillWin}
													on:change={(e) => handleWillWin(e, user)}
													class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
												/>
												<label
													for="will-win-checkbox-{user.$id}"
													class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
													>Up</label
												>
											</div>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<div class="flex flex-col md:flex-row gap-8">
			<div class="flex-1 bg-white rounded-lg shadow p-6">
				<label for="top-select" class="block mb-2 text-lg font-semibold text-gray-700"
					>Select a room:</label
				>
				<select
					bind:value={selectedGameRoom}
					id="top-select"
					class="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
				>
					{#each gameRooms || [] as room}
						<option value={room}>{room.Name}</option>
					{/each}
				</select>

				<div class="relative overflow-auto max-h-[70vh]">
					<table
						class="w-full border mt-2 rounded-lg overflow-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
					>
						<thead
							class="sticky top-0 z-20 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
						>
							<tr>
								<th scope="col" class="px-6 py-3"> Thông tin </th>
								<th scope="col" class="px-6 py-3"> Sđt </th>
								<th scope="col" class="px-6 py-3"> Checkin </th>
								<th scope="col" class="px-6 py-3"> Khối lượng GD </th>
								<th scope="col" class="px-6 py-3"> Loại khách hàng </th>
								<th scope="col" class="px-6 py-3"> Tiệc Offline </th>
								<th scope="col" class="px-6 py-3"> Đã thắng </th>
								<th scope="col" class="px-6 py-3"> Next </th>
							</tr>
						</thead>

						<tbody>
							{#each leftUsers as user}
								<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
									<th class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
										<div>
											<div class="font-bold">{user.Name}</div>
											<div class="text-sm opacity-80">{user.Email || 'N/A'}</div>
										</div>
									</th>
									<td class="px-6 py-4"> {user.PhoneNumber} </td>
									<td class="px-6 py-4">
										<div class="flex items-center mb-4">
											<input
												id="default-checkbox"
												type="checkbox"
												checked={user.IsCheckedIn}
												class="pointer-events-none w-5 h-5 rounded-lg text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
											/>
										</div>
									</td>
									<td class="px-6 py-4"> {user.VolumeLots || 'N/A'} </td>
									<td class="px-6 py-4">
										{#if user.Type === 'Trial'}
											<span
												class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset"
												>Trial
											</span>
										{:else if user.Type === 'Premier'}
											<span
												class="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-pink-700/10 ring-inset"
												>Premier
											</span>
										{:else}
											<span
												class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset"
												>Guest
											</span>
										{/if}
									</td>
									<td class="px-6 py-4">
										<div>
											<div class="font-bold mb-2">
												<ul>
													{#each user.RegisterPartyImagePath as file}
														<li class="text-sm text-primary cursor-pointer">
															- <a on:click={() => openImagePreview(file)}>Xem hình ảnh</a>
														</li>
													{/each}
												</ul>
											</div>
											<div class="text-sm opacity-80">
												<div class="flex items-center mb-4">
													<input
														id="default-checkbox-{user.$id}"
														type="checkbox"
														checked={user.IsPartyApproved}
														on:change={(e) => handleApprove(e, user)}
														class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
													/>
													<label
														for="default-checkbox-{user.$id}"
														class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
														>Duyệt</label
													>
												</div>
											</div>
										</div>
									</td>
									<td class="px-6 py-4">
										<div class="text-sm opacity-80">
											<div class="flex items-center mb-4">
												<input
													id="already-win-checkbox-{user.$id}"
													type="checkbox"
													checked={user.AlreadyWin}
													on:change={(e) => handleAlreadyWin(e, user)}
													class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
												/>
												<label
													for="already-win-checkbox-{user.$id}"
													class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
													>Đã thắng</label
												>
											</div>
										</div>
									</td>
									<td class="px-6 py-4">
										<div class="text-sm opacity-80">
											<div class="flex items-center mb-4">
												<input
													id="will-win-checkbox-{user.$id}"
													type="checkbox"
													checked={user.WillWin}
													on:change={(e) => handleWillWin(e, user)}
													class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
												/>
												<label
													for="will-win-checkbox-{user.$id}"
													class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
													>Up</label
												>
											</div>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.disabled {
		opacity: 0.2;
		pointer-events: none;
	}
	/* Since Tailwind is used, no extra styling here */
</style>
