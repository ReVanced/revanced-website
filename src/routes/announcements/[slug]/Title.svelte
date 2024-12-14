<script lang="ts">
	export let isEditing: boolean;
	export let isCreating: boolean;
	export let isPreviewing: boolean;
	export let title: string | undefined;
	export let titleInput: string;

	$: displayTitle = isPreviewing ? titleInput : title;
</script>

{#if (isEditing || isCreating) && !isPreviewing}
	<input bind:value={titleInput} class:empty={!titleInput?.trim()} placeholder="Enter title" />
{:else if displayTitle}
	<h1>
		{displayTitle}
	</h1>
{/if}

<style lang="scss">
	h1 {
		font-size: 2.5rem;
	}

	input {
		&,
		&:focus {
			border: none;
			outline: none;
			border-radius: 0;
		}

		width: 100%;
		padding: 0;

		color: var(--text-one);
		font-size: 2.5rem;
		font-weight: 700;
		line-height: 4rem;
		letter-spacing: -0.025em;
	}
</style>
