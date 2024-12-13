<script lang="ts">
	export let isEditing: boolean,
		isCreating: boolean,
		isPreviewing: boolean,
		author: string,
		authorElement: string;
</script>

{#if (isEditing || isCreating) && !isPreviewing}
	·
	<input
		bind:value={authorElement}
		class:empty={!authorElement?.trim()}
		placeholder="Enter author name"
	/>
{:else if isPreviewing ? author : authorElement}
	·
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
