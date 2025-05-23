<script lang="ts">
	export let isEditing: boolean;
	export let isCreating: boolean;
	export let isPreviewing: boolean;
	export let author: string | undefined;
	export let authorInput: string | undefined;

	$: displayAuthor = isPreviewing ? authorInput : author;
</script>

{#if (isEditing || isCreating) && !isPreviewing}
	·
	<input
		bind:value={authorInput}
		class:empty={!authorInput?.trim()}
		placeholder="Enter author name"
	/>
{:else if displayAuthor}
	·
	<span>
		{displayAuthor}
	</span>
{/if}

<style lang="scss">
	input {
		&,
		&:focus {
			border: none;
			outline: none;
			border-radius: 0;
		}

		padding: 0;
		font-size: 1rem;
		letter-spacing: 0.02rem;
	}
</style>
