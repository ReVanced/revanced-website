<script lang="ts">
	export let isEditing: boolean,
		isCreating: boolean,
		isPreviewing: boolean,
		title: string,
		titleElement: string;

	$: title = isPreviewing ? title : titleElement;
</script>

{#if (isEditing || isCreating) && !isPreviewing}
	<input bind:value={titleElement} class:empty={!titleElement?.trim()} placeholder="Enter title" />
{:else if title}
	<h1>
		{title}
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
