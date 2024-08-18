<script lang="ts">
	import Button from './Button.svelte';

	export let level: 'info' | 'warning' | 'caution' = 'info';

	let banner: Element;
</script>

<div class="banner-container {level}" bind:this={banner}>
	<div class="banner-text">
		<slot />
	</div>
	<Button type="text" icon="close" on:click={() => banner.remove()}>Dismiss</Button>
</div>

<style>
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
	}

	.banner-text {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
	}

	.banner-container.info {
		background-color: var(--surface-four);
		border-bottom: 2px solid var(--primary);
		color: var(--text-one);
	}

	.banner-container.warning {
		background-color: var(--yellow-one);
		border-bottom: 2px solid var(--yellow-two);
		color: #000;
	}

	.banner-container.warning > :global(button) {
		color: #000;
	}

	.banner-container.warning > :global(button img) {
		filter: grayscale(1) brightness(0); /* Make the icon black */
	}

	.banner-container.caution {
		background-color: var(--red-two);
		border-bottom: 2px solid var(--red-three);
		color: #fff;
	}

	.banner-container.caution > :global(button) {
		color: #fff;
	}

	.banner-container.caution > :global(button img) {
		filter: grayscale(1) brightness(0) invert(1); /* Make the icon white */
	}

	.banner-container > :global(button):hover {
		text-decoration: underline;
	}
</style>
