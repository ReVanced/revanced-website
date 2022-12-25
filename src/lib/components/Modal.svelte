<script lang="ts">
	import { fade } from 'svelte/transition';
	import { quadInOut } from 'svelte/easing';
	export let modalOpen = false;
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
		aria-modal="true"
		transition:fade={{ easing: quadInOut, duration: 250 }}
	>
		<div class="title">
			<h3>
				<slot name="title" />
			</h3>
		</div>

		{#if $$slots.description}
			<p>
				<slot name="description" />
			</p>
		{/if}

		<div class="slot"><slot /></div>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 999;
	}

	h3 {
		text-align: center;
	}

	.title {
		position: sticky;
		padding-top: 46px;
		padding-bottom: 20px;
		top: 0;
		width: 100%;
		background-color: var(--grey-six);
	}
	p {
		margin-bottom: 1rem;
	}

	.modal {
		position: fixed;
		width: min(85%, 425px);
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
		box-shadow: 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12),
			0px 2px 4px -1px rgba(0, 0, 0, 0.2);
	}

	.slot {
		padding: 0px 28px 36px 28px;
	}

	.modal::-webkit-scrollbar {
		display: none;
	}
</style>
