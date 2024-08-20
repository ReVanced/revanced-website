<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';

	export let level: 'info' | 'warning' | 'caution' = 'info';

	const dispatch = createEventDispatcher();
	let banner: Element;

	const dismiss = () => {
		banner.remove();
		dispatch('dismissed');
	};
</script>

<div class="banner-container {level}" bind:this={banner}>
	<div class="banner-text">
		<img src="../icons/{level}.svg" alt="{level}-icon" />
		<span><slot /></span>
	</div>
	<Button type="text" icon="close" on:click={dismiss}>Dismiss</Button>
</div>

<style>
	* {
		transition: none;
	}

	.banner-text :global(a) {
		color: inherit;
		text-decoration: none;
		font-weight: 700;
	}

	.banner-text :global(a:hover) {
		text-decoration: underline;
	}

	.banner-container {
		margin: 0;
		padding: 1.5rem 1.7rem;
		box-sizing: border-box;
		width: 100%;
		z-index: 999;
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.3rem;
	}

	.banner-text {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		gap: 0.55rem;
		word-wrap: break-word;
	}

	.banner-text > img {
		height: 2rem;
		width: auto;
	}

	.banner-container.info {
		background-color: var(--surface-four);
		border-bottom: 2px solid var(--primary);
		color: var(--text-one);
	}

	.banner-container.warning {
		background-color: var(--yellow-three);
		border-bottom: 2px solid var(--yellow-four);
		color: var(--yellow-one);
	}

	.banner-container.warning > :global(button) {
		color: var(--yellow-one);
	}

	.banner-container.warning > :global(button img),
	.banner-container.warning > .banner-text > img {
		filter: grayscale(1) brightness(0); /* Make the icon black */
	}

	.banner-container.caution {
		background-color: var(--red-two);
		border-bottom: 2px solid var(--red-three);
		color: var(--red-four);
	}

	.banner-container.caution > :global(button) {
		color: var(--red-four);
	}

	.banner-container.caution > :global(button img),
	.banner-container.caution > .banner-text > img,
	.banner-container.info > .banner-text > img {
		filter: grayscale(1) brightness(0) invert(1); /* Make the icon white */
	}

	.banner-container > :global(button):hover {
		text-decoration: underline;
	}

	@media screen and (max-width: 767px) {
		.banner-container {
			flex-direction: column;
			padding: 1.1rem 1.3rem;
		}

		.banner-container > :global(button) {
			align-self: flex-end;
		}
	}
</style>
