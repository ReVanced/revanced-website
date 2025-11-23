<script lang="ts">
	import { fade } from 'svelte/transition';
	import { quadInOut } from 'svelte/easing';

	import ArrowLeft from 'svelte-material-icons/ArrowLeft.svelte';

	let {
		dialogOpen = $bindable(false),
		fullscreen = false,
		notDismissible = false,
		icon,
		title,
		description,
		children,
		buttons
	}: {
		dialogOpen?: boolean;
		fullscreen?: boolean;
		notDismissible?: boolean;
		icon?: any;
		title?: any;
		description?: any;
		children?: any;
		buttons?: any;
	} = $props();

	let element = $state() as HTMLDialogElement;
	let y = $state(0);

	function parseScroll() {
		y = element.scrollTop;
	}
</script>

{#if dialogOpen}
	<div
		class="overlay"
		role="button"
		tabindex="0"
		onclick={() => {
			if (!notDismissible) dialogOpen = !dialogOpen;
		}}
		onkeypress={() => {
			if (!notDismissible) dialogOpen = !dialogOpen;
		}}
		transition:fade={{ easing: quadInOut, duration: 150 }}
	></div>

	<dialog
		class:fullscreen
		class:scrolled={y > 10}
		aria-modal="true"
		bind:this={element}
		onscroll={parseScroll}
		transition:fade={{ easing: quadInOut, duration: 150 }}
	>
		<div class="title" class:hasIcon={icon}>
			{#if fullscreen}
				<button id="back-button" onclick={() => (dialogOpen = !dialogOpen)}>
					<ArrowLeft size="24px" color="var(--surface-six)" />
				</button>
			{/if}
			{#if icon}
				{@render icon()}
			{/if}
			{#if title}
				<h3>
					{@render title()}
				</h3>
			{/if}
		</div>

		{#if description}
			<p>
				{@render description()}
			</p>
		{/if}

		<div class="slot">{@render children?.()}</div>

		{#if buttons}
			<div class="buttons">
				{@render buttons()}
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
