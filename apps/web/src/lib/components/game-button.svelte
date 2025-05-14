<button class="game-button orange">
	<slot />
</button>

<style lang="scss">
	.game-button {
		position: relative;
		top: 0;
		cursor: pointer;
		text-decoration: none !important;
		outline: none !important;
		font-family: 'Carter One', sans-serif;
		font-size: 26px;
		line-height: 1.5em;
		letter-spacing: 0.1em;
		color: #fff !important;
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
		border-radius: 8px;
		padding: 1vw 3vw 1vw;
		box-shadow:
			0 6px 0 #266b91,
			0 8px 1px 1px rgba(0, 0, 0, 0.3),
			0 10px 0 5px #12517d,
			0 12px 0 5px #1a6b9a,
			0 15px 0 5px #0c405e,
			0 15px 1px 6px rgba(0, 0, 0, 0.3);
	}

	.game-button:hover {
		top: 2px;
		box-shadow:
			0 4px 0 #266b91,
			0 6px 1px 1px rgba(0, 0, 0, 0.3),
			0 8px 0 5px #12517d,
			0 10px 0 5px #1a6b9a,
			0 13px 0 5px #0c405e,
			0 13px 1px 6px rgba(0, 0, 0, 0.3);
	}

	.game-button::before {
		content: '';
		height: 10%;
		position: absolute;
		width: 40%;
		background: #fff;
		right: 13%;
		top: -3%;
		border-radius: 99px;
	}

	.game-button::after {
		content: '';
		height: 10%;
		position: absolute;
		width: 5%;
		background: #fff;
		right: 5%;
		top: -3%;
		border-radius: 99px;
	}

	.game-button.orange {
		background: repeating-linear-gradient(45deg, #ffc800, #ffc800 5px, #ffc200 5px, #ffc200 10px);
		box-shadow:
			0 6px 0 #b76113,
			0 8px 1px 1px rgba(0, 0, 0, 0.3),
			0 10px 0 5px #75421f,
			0 12px 0 5px #8a542b,
			0 15px 0 5px #593116,
			0 15px 1px 6px rgba(0, 0, 0, 0.3);
		border-bottom: 3px solid rgba(205, 102, 0, 0.5);
		text-shadow:
			2px 2px 1px #e78700,
			-2px 2px 1px #e78700,
			2px -2px 1px #e78700,
			-2px -2px 1px #e78700,
			0px 2px 1px #e78700,
			0px -2px 1px #e78700,
			0px 4px 1px #c96100,
			2px 4px 1px #c96100,
			-2px 4px 1px #c96100;
	}
	.game-button.orange:hover {
		top: 2px;
		box-shadow:
			0 4px 0 #b76113,
			0 6px 1px 1px rgba(0, 0, 0, 0.3),
			0 8px 0 5px #75421f,
			0 10px 0 5px #8a542b,
			0 13px 0 5px #593116,
			0 13px 1px 6px rgba(0, 0, 0, 0.3);
	}
</style>
