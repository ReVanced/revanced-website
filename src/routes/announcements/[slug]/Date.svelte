<script lang="ts">
	import moment from 'moment';

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
{:else if displayCreatedAt}
	<span>
		{moment().diff(moment(displayCreatedAt), 'days') <= 7
			? moment(displayCreatedAt).fromNow()
			: moment(displayCreatedAt).format('MMMM D, YYYY [at] h:mm A')}

		{#if displayArchivedAt}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="24px"
				viewBox="0 -960 960 960"
				width="24px"
				fill="#ACC1D2"
			>
				<path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
			</svg>
			{moment().diff(moment(displayArchivedAt), 'days') <= 7
				? moment(displayArchivedAt).fromNow()
				: moment(displayArchivedAt).format('MMMM D, YYYY [at] h:mm A')}
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
