<script lang="ts">
	import type { WithChildren } from '$types';
	import type { Snippet } from 'svelte';

	type Props = {
		buttons?: Snippet;
	} & WithChildren;
	let { buttons, children }: Props = $props();
</script>

<div class="background">
	<div class="modal rounded">
		<div class="content">
			{@render children()}
		</div>
		{#if buttons}
			<div class="buttons">
				{@render buttons()}
			</div>
		{/if}
	</div>
</div>

<style>
	.background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}

	.modal {
		padding: 2rem;
		max-width: 90vw;
		max-height: 90vh;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.content {
		flex: 1;
	}

	.buttons {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
	}
</style>
