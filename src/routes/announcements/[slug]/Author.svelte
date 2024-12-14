<script lang="ts">
	export let isEditing: boolean,
		isCreating: boolean,
		isPreviewing: boolean,
		author: string,
		authorInput: string;

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
