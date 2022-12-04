<script lang="ts">
	import * as settings from '../../../data/api/settings';
	import { clear } from '../../../data/api/cache';
	let url = settings.api_base_url();
	function handler() {
		clear();
		settings.set_api_base_url(url);
		location.reload();
	}
	function reset() {
		url = settings.default_base_url;
	}
	import Modal from '$lib/components/atoms/Modal.svelte';
</script>

<Modal icon="/icons/settings.svg">
	<div class="settings-menu">
		<h3>Configure the backend</h3>
		<div class="url-stuff">
			<h4>Api URL:</h4>
			<div class="input-wrapper">
				<input name="api-url" type="text" bind:value={url} />
				<img on:click={reset} src="/icons/reset.svg" alt="tes" />
			</div>
		</div>
		<div class="btns">
			<button class="save-url-btn" on:click={handler}>
				<h4>Save</h4>
			</button>
			<button class="clear-cache-btn" on:click={clear}>
				<h4>Clear cache</h4>
			</button>
		</div>
	</div>
</Modal>

<style>
	div.settings-menu {
		position: fixed;
		width: min(95%, 500px);
		/* width: clamp(45vw, 850px, 850px); */
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 40px;
		border-radius: 12px;
		background-color: var(--grey-six);
		display: flex;
		user-select: none;
		gap: 5%;
		z-index: 999;
		white-space: normal;
		display: flex;
		flex-direction: column;
		gap: 2px;
		box-shadow: 0 3rem 5rem rgba(0, 0, 0, 0.3);
	}


	div.btns {
		display: flex;
		gap: 1rem;
        text-align: center;
		flex-wrap: wrap;
	}

	.btns button {
		min-width: max-content;
		font-size: 1rem;
		color: var(--white);
		font-weight: 600;
		border: none;
		border-radius: 12px;
		flex-grow: 2;
		padding: 1rem 1.75rem;
		display: block;
		cursor: pointer;
		background-color: var(--grey-two);
		transition: transform 0.4s var(--bezier-one), filter 0.4s var(--bezier-one);
		user-select: none;
	}

	.btns .save-url-btn {
		background-color: var(--accent-color);
		box-shadow: 0px 0px 32px 1px var(--accent-color-glow);
		flex-grow: 1;
	}
	.save-url-btn h4 {
		color: var(--grey-four);
	}
	div.input-wrapper {
		display: flex;
		background-color: #2a2c33;
		padding: 12px;
		width: 100%;
		margin: 10px 0 10px 0;
		border-radius: 10px;
	}

	img {
		height: 25px;
	}

	input[type='text'] {
		background-color: transparent;
		border: 0;
		color: white;
		font-size: 1rem;
		outline: none;
		width: 100%;
	}

	h3 {
		margin: 0 0 20px 0;
	}

	@media (max-width: 780px) {
		div.settings-menu {
			flex-direction: column;
			gap: 2rem;
		}
	}
</style>
