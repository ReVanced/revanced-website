<script lang="ts">
	import { relativeTime } from '$util/relativeTime';
	import moment from 'moment';
	import ArrowRight from 'svelte-material-icons/ArrowRight.svelte';

	let {
		isEditing,
		isCreating,
		isPreviewing,
		createdAt,
		createdAtInput = $bindable(),
		archivedAt,
		archivedAtInput = $bindable()
	}: {
		isEditing: boolean;
		isCreating: boolean;
		isPreviewing: boolean;
		createdAt: string | undefined;
		createdAtInput: string | undefined;
		archivedAt: string | undefined;
		archivedAtInput: string | undefined;
	} = $props();

	$effect(() => {
		if (createdAtInput) {
			const formatted = moment(createdAtInput).format('YYYY-MM-DDTHH:mm');
			if (createdAtInput !== formatted) {
				createdAtInput = formatted;
			}
		} else {
			createdAtInput = moment().format('YYYY-MM-DDTHH:mm');
		}
	});

	let displayCreatedAt = $derived(isPreviewing ? createdAtInput : createdAt);

	let displayArchivedAt = $derived.by(() => {
		const date = isPreviewing ? archivedAtInput : archivedAt;
		return date && moment(date).isBefore() ? date : null;
	});
</script>

{#if (isEditing || isCreating) && !isPreviewing}
	<span>
		<input type="datetime-local" max="9999-12-31T23:59" bind:value={createdAtInput} />
		{#if archivedAtInput}
			<ArrowRight size="24" />
			<input type="datetime-local" max="9999-12-31T23:59" bind:value={archivedAtInput} />
		{/if}
	</span>
{:else if displayCreatedAt}
	<span>
		{relativeTime(displayCreatedAt)}

		{#if displayArchivedAt}
			<ArrowRight size="24" />
			{relativeTime(displayArchivedAt)}
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
