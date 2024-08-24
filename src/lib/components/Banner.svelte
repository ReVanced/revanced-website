<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';

	export let level: 'info' | 'warning' | 'caution' = 'info';

	const dispatch = createEventDispatcher();
	let banner: Element;

	const removeElement = (e: AnimationEvent) => {
		if (e.animationName.includes('swipeUp')) (e.target as Element).remove();
	};

	const dismissBanner = () => {
		banner.classList.add('closed');
		dispatch('dismissed');
	};
</script>

<div class="banner-container" bind:this={banner} on:animationend={removeElement}>
	<div class="banner {level}">
		<div class="banner-text">
			<img src="../icons/{level}.svg" alt="{level}-icon" />
			<span><slot /></span>
		</div>
		<Button type="text" icon="close" on:click={dismissBanner}>Dismiss</Button>
	</div>
</div>

<style>
	.banner,
	.banner *,
	.banner :global(*) {
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
		z-index: 999;
		position: fixed;
		display: flex;
		justify-content: center;
		width: 100%;
		animation: dropDown var(--bezier-one) 0.7s forwards;
	}

	.banner-container.closed {
		animation: swipeUp var(--bezier-one) 1.5s forwards;
	}

	.banner {
		margin: 0;
		padding: 1.5rem 1.7rem;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.3rem;
		margin: 0.7rem 1rem;
		border-radius: 1rem;
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

	.banner.info {
		background-color: var(--surface-four);
		color: var(--text-one);
	}

	.banner.warning {
		background-color: var(--yellow-one);
		color: #000;
	}

	.banner.warning > :global(button) {
		color: #000;
	}

	.banner.warning > :global(button img),
	.banner.warning > .banner-text > img {
		filter: grayscale(1) brightness(0); /* Make the icon black */
	}

	.banner.caution {
		background-color: var(--red-two);
		color: #000;
	}

	.banner.caution > :global(button) {
		color: #000;
	}

	.banner.caution > :global(button img),
	.banner.caution > .banner-text > img,
	.banner.info > .banner-text > img {
		filter: grayscale(1) brightness(0); /* Make the icon white */
	}

	.banner > :global(button):hover {
		text-decoration: underline;
	}

	@media screen and (max-width: 767px) {
		.banner {
			flex-direction: column;
			padding: 1.1rem 1.3rem;
		}

		.banner > :global(button) {
			align-self: flex-end;
		}
	}

	@keyframes dropDown {
		0% {
			top: -100%;
		}
		100% {
			top: 0;
		}
	}

	@keyframes swipeUp {
		0% {
			top: 0;
		}
		100% {
			top: -100%;
		}
	}
</style>
