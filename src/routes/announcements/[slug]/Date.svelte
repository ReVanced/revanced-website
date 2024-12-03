<script lang="ts">
	import moment from 'moment';

	export let isEditing, isCreating, isPreviewing, createdAt, createdAtElement: string;
</script>

{#if (isEditing || isCreating) && !isPreviewing}
	<input type="datetime-local" max="9999-12-31T23:59" bind:value={createdAtElement} />
{:else}
	<span>
		{isPreviewing
			? moment(createdAtElement).format('MMMM D, YYYY [at] h:mm A')
			: moment(createdAt).format('MMMM D, YYYY [at] h:mm A')}
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
		&::-webkit-calendar-picker-indicator {
			filter: invert(88%) sepia(60%) saturate(4731%) hue-rotate(173deg) brightness(91%)
				contrast(111%);
		}

		padding: 0;
		color: var(--secondary);
		font-size: 1rem;
		font-weight: 400;
		letter-spacing: 0.02rem;
	}
</style>
