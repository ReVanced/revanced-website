<script lang="ts">
	import { relativeTime } from '$util/relativeTime';
	import moment from 'moment';
	import ArrowRight from 'svelte-material-icons/ArrowRight.svelte';

	export let isEditing: boolean;
	export let isCreating: boolean;
	export let isPreviewing: boolean;
	export let createdAt: string | undefined;
	export let createdAtInput: string | undefined;
	export let archivedAt: string | undefined;
	export let archivedAtInput: string | undefined;

	if (createdAtInput) {
		createdAtInput = moment(createdAtInput).format('YYYY-MM-DDTHH:mm');
	} else {
		createdAtInput = moment().format('YYYY-MM-DDTHH:mm');
	}

	$: displayCreatedAt = isPreviewing ? createdAtInput : createdAt;
	$: displayArchivedAt = isPreviewing ? archivedAtInput : archivedAt;
</script>

{#if (isEditing || isCreating) && !isPreviewing}
	<span>
		<label>
			Created
			<input type="datetime-local" max="9999-12-31T23:59" bind:value={createdAtInput} />
		</label>
		{#if archivedAtInput}
			<ArrowRight size="24" />
			<label>
				Archived
				<input type="datetime-local" max="9999-12-31T23:59" bind:value={archivedAtInput} />
			</label>
		{/if}
	</span>
{:else if displayCreatedAt}
	<span>
		Created {relativeTime(displayCreatedAt)}

		{#if displayArchivedAt}
			<ArrowRight size="24" />
			Archived {relativeTime(displayArchivedAt)}
		{/if}
	</span>
{/if}

<style lang="scss">
	span {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		column-gap: 1rem;
	}

	label {
		display: inline-flex;
		align-items: center;
		column-gap: 0.5rem;
	}

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
		font-size: 1rem;
		letter-spacing: 0.02rem;
	}
</style>
