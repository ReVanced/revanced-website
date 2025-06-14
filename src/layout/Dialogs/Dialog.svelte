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
	/>

	<dialog
		class:fullscreen
		class:scrolled={y > 10}
		aria-modal="true"
		bind:this={element}
		on:scroll={parseScroll}
		transition:fade={{ easing: quadInOut, duration: 150 }}
	>
		<div class="title" class:hasIcon={$$slots.icon}>
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

<style lang="scss">
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 6;
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
		border-radius: 26px;
		background-color: var(--surface-seven);
		display: flex;
		gap: 5%;
		white-space: normal;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		z-index: 7;
		padding: 32px;
		box-shadow:
			0px 4px 5px 0px rgba(0, 0, 0, 0.14),
			0px 1px 10px 0px rgba(0, 0, 0, 0.12),
			0px 2px 4px -1px rgba(0, 0, 0, 0.2);
		scrollbar-width: none;
		-ms-overflow-style: none;

		&::-webkit-scrollbar {
			display: none;
		}

		#back-button {
			cursor: pointer;
		}

		.hasIcon {
			flex-direction: column;
		}

		.title {
			display: flex;
			align-items: center;
			gap: 1rem;
			width: 100%;
			background-color: var(--surface-seven);
		}

		.buttons {
			display: flex;
			gap: 2rem;
			justify-content: flex-end;
			width: 100%;
		}

		&.fullscreen {
			padding: 0;
			max-height: 100%;
			width: 100%;
			border-radius: 0;

			&.scrolled .title {
				border-bottom: 1px solid var(--border);
			}

			.slot {
				padding: 0 32px 32px;
			}

			.title {
				justify-content: flex-start;
				position: sticky;
				padding: 32px;
				padding-bottom: 0.75rem;
				top: 0;
				left: 0;
			}
		}
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
