<script lang="ts">
	import { onMount } from 'svelte';
	import { client } from '$lib/storage/client';
	import { Databases, ID, Query, type Models } from 'appwrite';
	import { DATABASE_ID, CUSTOMER_ID, GAME_ID } from '$lib';

	type User = {
		$id: string;
		Name: string;
		PhoneNumber: string;
		Type: string;
		IsCheckedIn: boolean;
		location: string;
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
	let isFromNorthSide: boolean = false;

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

	function filter(data: User[], searchText: string, type: string[], isChecked: boolean, isFromNorthSide: boolean) {
		let result = data;
		result = result.filter((x) => x.Name?.includes(searchText || ''));

		if (type?.length) {
			result = result.filter((x) => type?.includes(x.Type));
		}

		if (isFromNorthSide) {
			result = result.filter((x) => x.location === 'HN');
		}

		if (isChecked) {
			result = result.filter((x) => x.IsCheckedIn);
		}

		return result;
	}

	onMount(() => {
		client.setEndpoint('https://appwrite.4fx.vn/v1').setProject('66e3bc690017f112ad9b');
		database = new Databases(client);

		fetGameRooms();
		fetchCustomers();
	});

	$: {
		if (selectedGameRoom) {
			leftUsers = selectedGameRoom.customer || [];
		}
	}

	$: displayRightUsers = filter(rightUsers, searchText, selectedTypes, isCheckedIn, isFromNorthSide);
</script>

<div class="bg-gray-50 min-h-screen p-6 flex flex-col items-center font-sans">
	<div class="w-full max-w-7xl">
		<!-- Select dropdown -->
		<div class="mb-4 flex justify-center flex-col items-center">
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
		</div>

		<!-- User columns container -->
		<div class="flex flex-col md:flex-row gap-8">
			<!-- Left column -->
			<div class="flex-1 bg-white rounded-lg shadow p-6">
				<h2 class="text-xl font-semibold mb-4 text-indigo-700">Customer in Room</h2>
				<ul class="space-y-4 max-h-[70vh] overflow-auto">
					{#each leftUsers as user}
						<li
							class="flex items-center justify-between p-3 border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow bg-gray-50"
						>
							<div class="text-gray-800 font-medium">
								<div class="text-lg flex items-center gap-2">
									{user.Name}
									{#if user.IsCheckedIn}
										<span
											class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset"
											>Check in
										</span>
									{/if}

									{#if user.Type === 'Guest'}
										<span
											class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset"
											>Guest
										</span>
									{/if}

									{#if user.Type === 'Trial'}
										<span
											class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset"
											>Trial
										</span>
									{/if}

									{#if user.Type === 'Premier'}
										<span
											class="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-pink-700/10 ring-inset"
											>Premier
										</span>
									{/if}
								</div>
								<div class="text-sm text-gray-500">{user.PhoneNumber}</div>
							</div>

							<button
								on:click={() => removeUserFromRoom(user)}
								class="ml-4 px-3 py-1 rounded bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
							>
								Remove
							</button>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Right column -->
			<div class="flex-1 bg-white rounded-lg shadow p-6">
				<h2 class="text-xl font-semibold mb-4 text-indigo-700">All Customers</h2>

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
						{#if isFromNorthSide}
							<button
								on:click={() => (isFromNorthSide = false)}
								class="rounded-md bg-slate-800 py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm"
							>
								HN
							</button>
						{:else}
							<button
								on:click={() => (isFromNorthSide = true)}
								class="rounded-md border border-slate-300 py-0.5 px-2.5 text-center text-sm transition-all shadow-sm text-slate-600"
							>
								HN
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

				<ul class="space-y-4 max-h-[60vh] overflow-auto">
					{#each displayRightUsers as user}
						{#if !leftUsers.some((x) => x.$id === user.$id)}
							<li
								class="flex items-center justify-between p-3 border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow bg-gray-50"
							>
								<button
									on:click={() => addUserToRoom(user)}
									class="px-3 py-1 rounded bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
								>
									Add
								</button>

								<div class="text-gray-800 font-medium text-end">
									<div class="text-lg flex items-center gap-2">
										{user.Name}
										{#if user.IsCheckedIn}
											<span
												class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset"
												>Check in
											</span>
										{/if}

										{#if user.Type === 'Guest'}
											<span
												class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset"
												>Guest
											</span>
										{/if}

										{#if user.Type === 'Trial'}
											<span
												class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset"
												>Trial
											</span>
										{/if}

										{#if user.Type === 'Premier'}
											<span
												class="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-pink-700/10 ring-inset"
												>Premier
											</span>
										{/if}
									</div>
									<div class="text-sm text-gray-500">{user.PhoneNumber}</div>
								</div>
							</li>
						{/if}
					{/each}
				</ul>
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
