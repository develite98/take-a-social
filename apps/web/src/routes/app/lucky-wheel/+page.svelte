<script lang="ts">
	import GameButton from '$lib/components/game-button.svelte';
	import { client } from '$lib/storage/client';
	import { Databases } from 'appwrite';
	import { onMount } from 'svelte';
	import { persisted } from 'svelte-persisted-store';
	import Select from 'svelte-select';
	import { get } from 'svelte/store';

	type User = {
		$id: string;
		Name: string;
		PhoneNumber: string;
		WillWin: boolean;
		AlreadyWin: boolean;
	};

	const slotSymbols = [
		[
			't',
			'Z',
			'C',
			'V',
			'e',
			'y',
			'i',
			'h',
			'K',
			'x',
			'M',
			'Q',
			'v',
			'q',
			'J',
			'z',
			'F',
			'r',
			'u',
			'o',
			'W',
			'j',
			'd',
			'G',
			'l',
			'Y',
			'O',
			'c',
			'n',
			'k',
			'm',
			'P',
			'D',
			'T',
			's',
			'b',
			'w',
			'H',
			'N',
			'U',
			'A',
			'X',
			'p',
			'B',
			'L',
			'f',
			'I',
			'R',
			'E',
			'g',
			'S',
			'a',
			'1',
			'3',
			'2',
			'4',
			'5',
			'6',
			'7',
			'8',
			'9',
			'0'
		]
	];

	let isSuccess = false;
	let playing = false;
	let buttonText = 'Start game';
	let intervalId: number;
	let scrollContainer: HTMLElement;

	let gameRooms: { Name: string; $id: string; customer: User[] }[];
	let gameRoomSelect: {
		Name: string;
		$id: string;
		customer: User[];
	} | null;

	let gameResultByRoom = persisted<Record<string, User[]> | undefined>('game-result', {});
	let willWinById: Record<string, boolean> = {};

	function createSymbolElement(symbol: string) {
		const div = document.createElement('div');
		div.classList.add('symbol');
		div.textContent = symbol;
		return div;
	}

	function updateGameResult(room: string | undefined, item: User) {
		if (!room) return;

		const current = get(gameResultByRoom);
		if (!current) return;

		const result = [...(current[room] || []), item];
		current[room] = result;

		gameResultByRoom.set(current);
	}

	function removeGameResult(room: string | undefined, item: User) {
		if (!room) return;

		const current = get(gameResultByRoom);
		if (!current) return;

		const result = (current[room] || []).filter((x) => x.PhoneNumber !== item.PhoneNumber);
		current[room] = result;

		gameResultByRoom.set(current);
	}

	function playGame() {
		reset();

		playing = true;
		buttonText = 'Are you ready...';
		startCountdown();
	}

	function startCountdown() {
		let value = 2;
		intervalId = setInterval(() => {
			value--;
			buttonText = 'Game starting...';
			if (value <= 0) {
				setTimeout(() => {
					buttonText = 'Wait result...';
				}, 1000);

				const customers = (customerByroom || []).filter(
					(x) => fullResult.findIndex((y) => y.PhoneNumber === x.PhoneNumber) === -1
				);

				let randomCustomer;
				const willWin = customers?.find((x) => willWinById[x.$id]);
				if (willWin) {
					randomCustomer = willWin;
				} else {
					randomCustomer = customers[Math.floor(Math.random() * (customers?.length || 1))];
				}

				const phone = randomCustomer?.PhoneNumber || '';

				spin(phone.slice(-5), undefined, randomCustomer);

				clearInterval(intervalId);
				return;
			}
		}, 1000);
	}

	function success() {
		setTimeout(() => {
			playing = false;
			buttonText = 'Start game';
			isSuccess = true;
		}, 1000);
	}

	function spin(code?: string, duration?: number, customer?: any) {
		const slots = document.querySelectorAll('.slot');
		let completedSlots = 0;
		slots.forEach((slot, index) => {
			const symbols = slot.querySelector('.symbols') as HTMLElement;
			if (symbols) {
				const symbolHeight = symbols.querySelector('.symbol')?.clientHeight || 1;
				const symbolCount = symbols.childElementCount;
				symbols.innerHTML = '';
				symbols.appendChild(createSymbolElement('❔'));
				if (duration) {
					symbols.style.transition = `top ${duration}s`;
				}

				for (let i = 0; i < 5; i++) {
					slotSymbols[0].forEach((symbol) => {
						symbols.appendChild(createSymbolElement(symbol));
					});
				}

				if (code) {
					const codeIndex = slotSymbols[0].findIndex((v) => v === code[index]);
					const offset = -Math.floor((codeIndex + 1) * symbolHeight);
					symbols.style.top = `${offset}px`;
				} else {
					const randomOffset = -Math.floor(Math.random() * (symbolCount - 1) + 1) * symbolHeight;
					symbols.style.top = `${randomOffset}px`;
				}

				symbols.addEventListener(
					'transitionend',
					() => {
						completedSlots++;
						if (completedSlots === slots.length) {
							success();
						}
					},
					{ once: true }
				);
			}
		});

		if (customer)
			setTimeout(() => {
				if (!gameRoomSelect) return;

				updateGameResult(gameRoomSelect?.$id, customer);
			}, 5000);
	}

	function reset() {
		const slots = document.querySelectorAll('.slot');

		slots.forEach((slot) => {
			const symbols = slot.querySelector('.symbols') as HTMLElement;
			if (symbols) {
				symbols.style.transition = 'none';
				symbols.style.top = '0';
				symbols.offsetHeight;
				symbols.style.transition = '';
			}
		});
	}

	function initGame() {
		reset();
		spin();
		playing = false;
	}

	onMount(() => {
		initGame();

		client.setEndpoint('https://appwrite.4fx.vn/v1').setProject('66e3bc690017f112ad9b');

		const database = new Databases(client);

		database.listDocuments('681733e5001f16726eef', '6817344f000b4374121d').then((res) => {
			gameRooms = res.documents as unknown as {
				Name: string;
				$id: string;
				customer: User[];
			}[];

			gameRooms = gameRooms?.map((x) => {
				x.customer = x.customer?.filter((x) => !x.AlreadyWin);
				return x;
			});

			const storageId = localStorage.getItem('game-room-active') as string;
			if (storageId) {
				gameRoomSelect = gameRooms?.find(x => x.$id === storageId) || gameRooms[0];
			} else {
				gameRoomSelect =  gameRooms[0];
			}
		});

		client.subscribe(
			'databases.681733e5001f16726eef.collections.68173407002237cbba6a.documents',
			(result) => {
				const user = result.payload as unknown as User;
				willWinById[user.$id] = user.WillWin;

				if (gameRooms) {
					gameRooms = gameRooms?.map((x) => {
						x.customer = x.customer?.map(customer => {
							if (customer.$id === user.$id) {
								customer.AlreadyWin = user.AlreadyWin;
							}

							return customer
						})

						return x;
					});

					gameRoomSelect = gameRooms?.find(x => x.$id === gameRoomSelect?.$id) || null;
				}
			}
		);
	});

	const scrollToBottom = () => {
		if (scrollContainer) {
			setTimeout(() => {
			scrollContainer.scrollTop = scrollContainer.scrollHeight;

			}, 1000)
		}
	}

	const filterCanNotRoll = (gameRoomSelect: any, gameResult: Record<string, User[]>, customerByRoom: User[]) => {
		return gameRoomSelect && gameResult &&  customerByRoom?.every(customer => fullResult.some(x => x.$id === customer.$id));
	}

	$: fullResult =  Object.values($gameResultByRoom || {}).flat();
	$: gameResults = gameRoomSelect ? $gameResultByRoom?.[gameRoomSelect.$id] || [] : [];
	$: customerByroom = gameRoomSelect?.customer?.filter(x => !x.AlreadyWin) || [];
	$: canNotRoll = filterCanNotRoll(gameRoomSelect, $gameResultByRoom || {}, customerByroom);
	$: gameResults, scrollToBottom();
</script>

<div class="luckywheel-wrap">
	<div class="confetti">
		<div class="confetti-piece"></div>
		<div class="confetti-piece"></div>
		<div class="confetti-piece"></div>
		<div class="confetti-piece"></div>
		<div class="confetti-piece"></div>
		<div class="confetti-piece"></div>
		<div class="confetti-piece"></div>
		<div class="confetti-piece"></div>
		<div class="confetti-piece"></div>
		<div class="confetti-piece"></div>
		<div class="confetti-piece"></div>
		<div class="confetti-piece"></div>
		<div class="confetti-piece"></div>
		<div class="confetti-piece"></div>
		<div class="confetti-piece"></div>
		<div class="confetti-piece"></div>
	</div>

	<div class="luckywheel-wrap__background"></div>

	<div class="luckywheel-wrap__overlay"></div>

	<div class="slot-machine result-board">
		<div class="game-room-select">
			<Select items={gameRooms} label={'Name'} itemId={'$id'} bind:value={gameRoomSelect}  on:change={(e) => {
				localStorage.setItem('game-room-active', e.detail?.$id);
				window.location.reload();
			}} ></Select>
		</div>

		<h1 style="font-size: 32px;">Winners</h1>
		<div class="w-full max-h-[160px] overflow-auto" bind:this={scrollContainer}>
			<div class="item">
				<h3>1st:</h3>
				<div class="name flex items-center gap-2">
					{#if gameResults[0]?.PhoneNumber}
						{gameResults[0]?.Name} - {gameResults[0]?.PhoneNumber.slice(-5)}
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<span on:click={() => removeGameResult(gameRoomSelect?.$id, gameResults[0])}
							><img width="32" src="/icon-close.svg" alt="" /></span
						>
					{:else}
						...
					{/if}
				</div>
			</div>
			<div class="item">
				<h3>2nd:</h3>
				<div class="name flex items-center gap-2">
					{#if gameResults[1]?.PhoneNumber}
						{gameResults[1]?.Name} - {gameResults[1]?.PhoneNumber.slice(-5)}
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<span on:click={() => removeGameResult(gameRoomSelect?.$id, gameResults[1])}
							><img width="32" src="/icon-close.svg" alt="" /></span
						>
					{:else}
						...
					{/if}
				</div>
			</div>
			<div class="item">
				<h3>3rd:</h3>

				<div class="name flex items-center gap-2">
					{#if gameResults[2]?.PhoneNumber}
						{gameResults[2]?.Name} - {gameResults[2]?.PhoneNumber.slice(-5)}
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<span on:click={() => removeGameResult(gameRoomSelect?.$id, gameResults[2])}
							><img width="32" src="/icon-close.svg" alt="" /></span
						>
					{:else}
						...
					{/if}
				</div>
			</div>

			<!-- From 4th to 10th if they exist -->
			{#each gameResults.slice(3, 10) as result, i}
				<div class="item">
					<h3>{i + 4}th:</h3>
					<div class="name flex items-center gap-2">
						{#if result?.PhoneNumber}
							{result.Name} - {result.PhoneNumber.slice(-5)}
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<span on:click={() => removeGameResult(gameRoomSelect?.$id, result)}
								><img width="32" src="/icon-close.svg" alt="" /></span
							>
						{:else}
							...
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="luckywheel-wrap__main-game" class:d-none={isSuccess}>
		<div class="container">
			<div class="slotcontainer">
				<div class="slot-machine">
					<div class="slot">
						<div class="symbols" id="slot1Symbols"></div>
					</div>

					<div class="slot">
						<div class="symbols" id="slot1Symbols"></div>
					</div>

					<div class="slot">
						<div class="symbols" id="slot1Symbols"></div>
					</div>

					<div class="slot">
						<div class="symbols" id="slot1Symbols"></div>
					</div>

					<div class="slot">
						<div class="symbols" id="slot1Symbols"></div>
					</div>
				</div>
			</div>
		</div>

		<div class="container">
			<div
				class="flex justify-center items-center"
				class:--disabled={playing}
				on:click={playGame}
				class:disabled={canNotRoll}
			>
				<GameButton>{canNotRoll ? 'No more gift' : buttonText}</GameButton>
			</div>
		</div>
	</div>

	<!-- <div class="luckywheel-wrap__winning"
         [class.d-flex]="isSuccess">
      <div class="winner-container">
        <h1>Xin chúc mừng</h1>
        <h2 class="mb-3">
          Khách hàng có sđt
          <span class="text-danger text-2xl">{{ winner?.phoneNumber }}</span><br> với
          mã code <span class="text-success text-2xl">{{ winner?.code }}</span> đã
          trúng thưởng
        </h2>
  
        <mix-game-btn class="d-block mt-5"
                      (click)="isSuccess = false; winner = undefined">Chơi tiếp</mix-game-btn>
      </div>
    </div> -->

	<!-- <mix-fire-work></mix-fire-work> -->
</div>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css?family=Carter+One');
</style>
