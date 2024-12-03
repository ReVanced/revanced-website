<script lang="ts">
	export let isEditing, isCreating, isPreviewing, title, titleElement: string;
</script>

{#if (isEditing || isCreating) && !isPreviewing}
	<input bind:value={titleElement} class:empty={!titleElement.trim()} placeholder="Enter title" />
{:else}
	<h1>
		{isPreviewing ? titleElement : title}
	</h1>
{/if}

<style lang="scss">
	h1 {
		color: var(--text-one);
		font-size: 2.5rem;
		font-weight: 700;
		letter-spacing: -0.025em;
		border-bottom: 1px solid var(--grey-three);
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
