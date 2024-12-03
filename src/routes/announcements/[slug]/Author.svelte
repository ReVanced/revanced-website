<script lang="ts">
	export let isEditing, isCreating, isPreviewing, author, authorElement: string;
</script>

{#if (isEditing || isCreating) && !isPreviewing}
	<input
		bind:value={authorElement}
		class:empty={!authorElement.trim()}
		placeholder="Enter author name"
	/>
{:else}
	<span>
		{isPreviewing ? authorElement : author}
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
