<script lang="ts">
	import { fade } from 'svelte/transition';
	import { quadInOut } from 'svelte/easing';

	import ArrowLeft from 'svelte-material-icons/ArrowLeft.svelte';

	export let dialogOpen = false;
	export let fullscreen = false;
	export let notDismissible = false;

	let element: HTMLDialogElement;
	let y = 0;

	function parseScroll() {
		y = element.scrollTop;
	}
</script>

{#if dialogOpen}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="overlay"
		on:click={() => {
			if (!notDismissible) dialogOpen = !dialogOpen;
		}}
		on:keypress={() => {
			if (!notDismissible) dialogOpen = !dialogOpen;
		}}
		transition:fade={{ easing: quadInOut, duration: 150 }}
	></div>

	<dialog
		class:fullscreen
		class:scrolled={y > 10}
		class:hasIcon={$$slots.icon}
		aria-modal="true"
		bind:this={element}
		on:scroll={parseScroll}
		transition:fade={{ easing: quadInOut, duration: 150 }}
	>
		<div class="title">
			{#if fullscreen}
				<button id="back-button" on:click={() => (dialogOpen = !dialogOpen)}>
					<ArrowLeft size="24px" color="var(--surface-six)" />
				</button>
			{/if}
			{#if $$slots.icon}
				<slot name="icon" />
			{/if}
			{#if $$slots.title}
				<h3>
					<slot name="title" />
				</h3>
			{/if}
		</div>

		{#if $$slots.description}
			<p>
				<slot name="description" />
			</p>
		{/if}

		<div class="slot"><slot /></div>

		{#if $$slots.buttons}
			<div class="buttons">
				<slot name="buttons" />
			</div>
		{/if}
	</dialog>
{/if}

<style>
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.65);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		z-index: 6;
		animation: overlayFadeIn var(--transition-base) var(--bezier-one);
	}

	@keyframes overlayFadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	dialog {
		position: fixed;
		width: min(85%, 425px);
		max-height: 75%;
		overflow-y: scroll;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border: none;
		border-radius: 20px;
		background: var(--glass-background);
		backdrop-filter: var(--backdrop-blur);
		-webkit-backdrop-filter: var(--backdrop-blur);
		border: 1px solid var(--glass-border);
		display: flex;
		gap: 5%;
		white-space: normal;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		z-index: 7;
		padding: 32px;
		box-shadow: var(--drop-shadow-two);
		scrollbar-width: none;
		-ms-overflow-style: none;
		animation: dialogFadeIn var(--transition-base) var(--bezier-one);
	}

	@keyframes dialogFadeIn {
		from {
			opacity: 0;
			transform: translate(-50%, -48%);
		}
		to {
			opacity: 1;
			transform: translate(-50%, -50%);
		}
	}

	dialog::-webkit-scrollbar {
		display: none;
	}

	dialog #back-button {
		cursor: pointer;
	}

	dialog.hasIcon {
		flex-direction: column;
	}

	dialog .title {
		display: flex;
		align-items: center;
		gap: 1rem;
		width: 100%;
		background-color: transparent;
	}

	dialog .buttons {
		display: flex;
		gap: 2rem;
		justify-content: flex-end;
		width: 100%;
	}

	dialog.fullscreen {
		padding: 0;
		max-height: 100%;
		width: 100%;
		border-radius: 0;
	}

	dialog.fullscreen.scrolled .title {
		border-bottom: 1px solid var(--border);
	}

	dialog.fullscreen .slot {
		padding: 0 32px 32px;
	}

	dialog.fullscreen .title {
		justify-content: flex-start;
		position: sticky;
		padding: 32px;
		padding-bottom: 0.75rem;
		top: 0;
		left: 0;
	}

	button {
		padding: 0;
		margin: 0;
		border: none;
		background-color: transparent;
		display: flex;
		align-items: center;
	}

	.slot {
		display: flex;
		flex-direction: column;
		align-content: center;
		width: 100%;
	}
</style>
