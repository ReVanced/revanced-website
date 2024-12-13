<script lang="ts">
	import moment from 'moment';

	export let isEditing: boolean,
		isCreating: boolean,
		isPreviewing: boolean,
		createdAt: string,
		createdAtInput: string,
		archivedAt: string | undefined,
		archivedAtInput: string;

	// Ensure createdAtInput is properly formatted for the datetime-local input
	if (createdAtInput) {
		createdAtInput = createdAtInput.split('.')[0];
	} else {
		createdAtInput = new Date().toISOString().split('.')[0].slice(0, -3);
	}

	$: created = isPreviewing ? createdAtInput : createdAt;
	$: archived = isPreviewing ? archivedAtInput : archivedAt;
</script>

{#if (isEditing || isCreating) && !isPreviewing}
	<span>
		<input type="datetime-local" max="9999-12-31T23:59" bind:value={createdAtInput} />
		{#if archivedAtInput}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="24px"
				viewBox="0 -960 960 960"
				width="24px"
				fill="#ACC1D2"
			>
				<path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
			</svg>
			<input type="datetime-local" max="9999-12-31T23:59" bind:value={archivedAtInput} />
		{/if}
	</span>
{:else if created}
	<span>
		{moment().diff(moment(created), 'days') <= 7
			? moment(created).fromNow()
			: moment(created).format('MMMM D, YYYY [at] h:mm A')}

		{#if archived}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="24px"
				viewBox="0 -960 960 960"
				width="24px"
				fill="#ACC1D2"
			>
				<path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
			</svg>
			{moment().diff(moment(archived), 'days') <= 7
				? moment(archived).fromNow()
				: moment(archived).format('MMMM D, YYYY [at] h:mm A')}
		{/if}
	</span>
{/if}

<style lang="scss">
	span {
		display: inline-flex;
		align-items: center;
		gap: 1rem;
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
