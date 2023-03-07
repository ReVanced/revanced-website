<script lang="ts">
	import { fade } from 'svelte/transition';
	import { quadInOut } from 'svelte/easing';
	export let modalOpen = false;
	export let fullscreen = false;
</script>

{#if modalOpen}
	<div
		class="overlay"
		on:click={() => (modalOpen = !modalOpen)}
		on:keypress={() => (modalOpen = !modalOpen)}
		transition:fade={{ easing: quadInOut, duration: 150 }}
	/>

	<div
		class="modal"
		role="dialog"
		class:fullscreen
		aria-modal="true"
		transition:fade={{ easing: quadInOut, duration: 150 }}
	>
		<div class="top">
			<div class="title">
				{#if fullscreen}
					<button on:click={() => (modalOpen = !modalOpen)}>
						<img src="../icons/back.svg" id="back" alt="back" />
					</button>
				{/if}
				{#if $$slots.icon}
					<slot name="icon" />
				{/if}
				{#if $$slots.title}
					<h2>
						<slot name="title" />
					</h2>
				{/if}
			</div>

			{#if $$slots.description}
				<p>
					<slot name="description" />
				</p>
			{/if}
		</div>

		<div class="slot"><slot /></div>
	</div>
{/if}

<style>
	p {
		color: var(--white);
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 999;
	}

	.top {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 20px;
	}

	.title {
		position: sticky;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		top: 0;
		left: 0;
		width: 100%;
		background-color: var(--grey-six);
		margin-bottom: 16px;
	}

	.modal {
		position: fixed;
		min-width: 17.5rem;
		max-width: 35rem;
		max-height: 75%;
		overflow-y: scroll;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 26px;
		background-color: var(--grey-six);
		display: flex;
		user-select: none;
		gap: 5%;
		white-space: normal;
		display: flex;
		flex-direction: column;
		gap: 2px;
		z-index: 1001;
		padding: 1.5rem;
		box-shadow: 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12),
			0px 2px 4px -1px rgba(0, 0, 0, 0.2);
	}

	button {
		padding: 0;
		margin: 0;
		border: none;
		background-color: transparent;
		display: flex;
		align-items: center;
	}

	#back {
		height: 24px;
	}

	.fullscreen {
		max-height: 100%;
		width: 100%;
		border-radius: 0;
	}
	.fullscreen .title {
		justify-content: flex-start;
	}

	.slot {
		display: flex;
		flex-direction: column;
		align-content: center;
	}

	.modal::-webkit-scrollbar {
		display: none;
	}
</style>
