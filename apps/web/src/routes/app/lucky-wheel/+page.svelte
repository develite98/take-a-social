<script lang="ts">
	import GameButton from '$lib/components/game-button.svelte';
	import { client } from '$lib/storage/client';
	import { Databases } from 'appwrite';
	import { onMount } from 'svelte';
	import Select from 'svelte-select';

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
	let gameRooms: { Name: string; $id: string; customer: { Name: string; PhoneNumber: string }[] }[];
	let gameRoomSelect: {
		Name: string;
		$id: string;
		customer: { Name: string; PhoneNumber: string }[];
	} | null;
	let gameResults: { Name: string; PhoneNumber: string }[] = [];

	function createSymbolElement(symbol: string) {
		const div = document.createElement('div');
		div.classList.add('symbol');
		div.textContent = symbol;
		return div;
	}

	function playGame() {
		reset();

		playing = true;
		buttonText = 'Are you ready...';
		startCountdown();
	}

	function startCountdown() {
		let value = 4;
		intervalId = setInterval(() => {
			value--;
			buttonText = value.toString();
			if (value <= 0) {
				setTimeout(() => {
					buttonText = 'Wait result...';
				}, 1000);

				const customers = (gameRoomSelect?.customer || []).filter(
					(x) => gameResults.findIndex((y) => y.PhoneNumber === x.PhoneNumber) === -1
				);
				const randomCustomer =
					customers[Math.floor(Math.random() * (gameRoomSelect?.customer?.length || 1))];

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
		}, 5000);
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
				gameResults = gameResults.concat(customer);
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
				customer: { Name: string; PhoneNumber: string }[];
			}[];
			gameRoomSelect = gameRooms[0];
		});
	});

	$: {
		if (gameRoomSelect) {
			gameResults = [];
		}
	}
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
	</div>
	<!-- <mix-game-confetti *ngIf="isSuccess"
                       class="luckywheel-wrap__game-confetti"></mix-game-confetti> -->

	<div class="luckywheel-wrap__background"></div>

	<div class="luckywheel-wrap__overlay"></div>

	<div class="slot-machine result-board">
		<div class="game-room-select">
			<Select items={gameRooms} label={'Name'} itemId={'$id'} bind:value={gameRoomSelect}></Select>
		</div>

		<h1 style="font-size: 32px;">Winners</h1>
		<div class="item">
			<h3>1st:</h3>
			<div class="name">
				{#if gameResults[0]?.PhoneNumber}
					{gameResults[0]?.Name} - {gameResults[0]?.PhoneNumber.slice(-5)}
				{:else}
					...
				{/if}
			</div>
		</div>
		<div class="item">
			<h3>2nd:</h3>
			<div class="name">
				{#if gameResults[1]?.PhoneNumber}
					{gameResults[1]?.Name} - {gameResults[1]?.PhoneNumber.slice(-5)}
				{:else}
					...
				{/if}
			</div>
		</div>
		<div class="item">
			<h3>3rd:</h3>

			<div class="name">
				{#if gameResults[2]?.PhoneNumber}
					{gameResults[2]?.Name} - {gameResults[2]?.PhoneNumber.slice(-5)}
				{:else}
					...
				{/if}
			</div>
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
				class="d-flex justify-content-center align-items-center"
				class:--disabled={playing}
				on:click={playGame}
			>
				<GameButton>{buttonText}</GameButton>
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

	.lucky-wheel {
		.ngneat-dialog-backdrop {
			padding: 0px !important;
		}

		.ngneat-dialog-content {
			padding: 0px !important;
		}
	}

	.--disabled {
		pointer-events: none;
		cursor: none;
		opacity: 0.8;
	}

	.luckywheel-wrap {
		width: 100vw;
		height: 100vh;
		background-color: tomato;
		position: relative;

		&__background {
			height: 100%;
			width: 100%;
			background-image: url(/game-background.png);
			background-size: 100% 100%;
			background-repeat: no-repeat;
			position: relative;

			.bg-gift-l {
				position: absolute;
				bottom: -9vw;
				right: -1vw;
				width: 30vw;
			}

			.bg-gift-r {
				position: absolute;
				bottom: -9vw;
				left: -1vw;
				width: 30vw;
				transform: rotateY(180deg);
			}

			.bg-light {
				position: absolute;
				top: 0;
				width: 100%;
				height: 10vh;
				background-size: cover;
				background-repeat: repeat;
			}
		}

		&__overlay {
			height: 100%;
			width: 100%;
			background-color: rgba(0, 0, 0, 0.5);
			position: absolute;
			top: 0px;
		}

		&__main-game {
			height: 85vh;
			width: 100%;
			position: absolute;
			top: 0px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-end;
		}

		&__winning {
			display: none;
			height: 100%;
			width: 100%;
			position: absolute;
			top: 0px;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.winner-container {
				width: 65vw;
				height: 40vh;
				background-image: url(/assets/images/bg-text-1.png);
				background-size: 100% 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				gap: 6px;
			}
		}

		&__game-confetti {
			position: absolute;
			top: 0;
			width: 100%;
			z-index: 3;
		}
	}

	.slotcontainer {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 60px;
	}

	.slot-machine {
		display: flex;
		justify-content: center;
		align-items: center;
		width: fit-content;
		gap: 16px;
		padding: 32px;
		--shadowColor: 187 60% 40%;
		display: flex;
		flex-wrap: wrap;
		background: hsl(187 70% 85%);
		box-shadow: 0px 8px 0px 7px hsl(var(--shadowColor) / 1);
		border-radius: 0.8rem;
		overflow: hidden;
		border: 0.2rem solid;
	}

	.slot {
		width: 150px;
		height: 190px;
		border: 1px solid black;
		display: inline-block;
		overflow: hidden;
		position: relative;
		background: #fafafa;
		font-family: 'Carter One', sans-serif;
		text-decoration: none !important;
		outline: none !important;
		font-family: 'Carter One', sans-serif;
		font-size: 150px;
		text-align: center;
		line-height: 1.5em;
		letter-spacing: 0.1em;
		text-shadow:
			2px 2px 1px #0066a2,
			-2px 2px 1px #0066a2,
			2px -2px 1px #0066a2,
			-2px -2px 1px #0066a2,
			0px 2px 1px #0066a2,
			0px -2px 1px #0066a2,
			0px 4px 1px #004a87,
			2px 4px 1px #004a87,
			-2px 4px 1px #004a87;
		border: none;
		margin-top: -20px;
		background: repeating-linear-gradient(45deg, #3ebbf7, #3ebbf7 5px, #45b1f4 5px, #45b1f4 10px);
		border-bottom: 3px solid rgba(16, 91, 146, 0.5);
		border-top: 3px solid rgba(255, 255, 255, 0.3);
		color: #fff !important;
		border-radius: 8px;
		box-shadow:
			0 6px 0 #266b91,
			0 8px 1px 1px rgba(0, 0, 0, 0.3),
			0 10px 0 5px #12517d,
			0 12px 0 5px #1a6b9a,
			0 15px 0 5px #0c405e,
			0 15px 1px 6px rgba(0, 0, 0, 0.3);
	}

	.slot::before {
		content: '';
		height: 10%;
		position: absolute;
		width: 40%;
		background: #fff;
		right: 13%;
		top: -3%;
		border-radius: 99px;
	}

	.slot::after {
		content: '';
		height: 10%;
		position: absolute;
		width: 5%;
		background: #fff;
		right: 5%;
		top: -3%;
		border-radius: 99px;
	}

	.slot .symbols {
		position: absolute;
		top: 0;
		left: 0;
		transition: top 5s;
	}

	.slot .symbol {
		width: 100px;
		height: 150px;
		font-size: 60px;
		line-height: 100px;
		display: block;
		text-align: center;
		padding-top: 25px;
	}

	.invisible {
		visibility: hidden;
	}

	.disabled {
		pointer-events: none;
		cursor: none;
	}

	.game-room-select {
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2;
		width: 360px;
		margin: 0 auto;
		margin-top: -32px;

		--border-radius: 99px !important;
		--border: 2px solid hsl(var(--shadowColor) / 1);
		--font-size: 20px;
	}

	.result-board {
		min-width: 520px;
		position: absolute;
		top: 10vh;
		right: 50%;
		transform: translateX(50%);
		padding: 16px 42px 42px 42px !important;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		border-radius: 54px;
		overflow: unset !important;
		z-index: 100;

		h1 {
			width: 100%;
			text-align: center;
			margin-bottom: 24px;
			font-size: 24px;
			font-family: 'Carter One', sans-serif;
			color: #fefffb !important;
			text-shadow:
				2px 2px 1px #0066a2,
				-2px 2px 1px #0066a2,
				2px -2px 1px #0066a2,
				-2px -2px 1px #0066a2,
				0px 2px 1px #0066a2,
				0px -2px 1px #0066a2,
				0px 4px 1px #004a87,
				2px 4px 1px #004a87,
				-2px 4px 1px #004a87;
		}

		.item {
			font-size: 18px;

			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 8px;
			gap: 12px;
		}

		.name {
			font-size: 24px;
			font-weight: bold;
			color: #fefffb !important;
			text-shadow:
				2px 2px 1px #0066a2,
				-2px 2px 1px #0066a2,
				2px -2px 1px #0066a2,
				-2px -2px 1px #0066a2,
				0px 2px 1px #0066a2,
				0px -2px 1px #0066a2,
				0px 4px 1px #004a87,
				2px 4px 1px #004a87,
				-2px 4px 1px #004a87;
		}

		h3 {
			margin: 0px;
			font-family: 'Carter One', sans-serif;
			color: #fefffb !important;
			text-shadow:
				2px 2px 1px #0066a2,
				-2px 2px 1px #0066a2,
				2px -2px 1px #0066a2,
				-2px -2px 1px #0066a2,
				0px 2px 1px #0066a2,
				0px -2px 1px #0066a2,
				0px 4px 1px #004a87,
				2px 4px 1px #004a87,
				-2px 4px 1px #004a87;
		}
	}

	$yellow: #ffd300;
	$blue: #17d3ff;
	$pink: #ff4e91;

	$duration: 1000;

	@function randomNum($min, $max) {
		$rand: random();
		$randomNum: $min + floor($rand * (($max - $min) + 1));

		@return $randomNum;
	}

	.confetti {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		width: 100%;
		height: 50vh;
		overflow: hidden;
		top: 20%;
	}

	.confetti-piece {
		position: absolute;
		width: 16px;
		height: 24px;
		background: $yellow;
		top: 0;
		opacity: 0;

		@for $i from 1 through 13 {
			&:nth-child(#{$i}) {
				left: $i * 7%;
				transform: rotate(#{randomNum(-80, 80)}deg);
				animation: makeItRain $duration * 1ms infinite ease-out;
				animation-delay: #{randomNum(0, $duration * 0.5)}ms;
				animation-duration: #{randomNum($duration * 0.7, $duration * 1.2)}ms;
			}
		}

		&:nth-child(odd) {
			background: $blue;
		}

		&:nth-child(even) {
			z-index: 1;
		}

		&:nth-child(4n) {
			width: 8px;
			height: 16px;
			animation-duration: $duration * 2ms;
		}

		&:nth-child(3n) {
			width: 5px;
			height: 12px;
			animation-duration: $duration * 2.5ms;
			animation-delay: $duration * 1ms;
		}

		&:nth-child(4n-7) {
			background: $pink;
		}
	}

	@keyframes makeItRain {
		from {
			opacity: 0;
		}

		50% {
			opacity: 1;
		}

		to {
			transform: translateY(50vh);
		}
	}
</style>
