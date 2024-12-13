<script lang="ts">
	import moment from 'moment';

	export let isEditing: boolean,
		isCreating: boolean,
		isPreviewing: boolean,
		createdAt: string,
		createdAtElement: string,
		archivedAt: string | undefined,
		archivedAtElement: string;

	// Ensure createdAtElement is properly formatted for the datetime-local input
	if (createdAtElement) {
		createdAtElement = createdAtElement.split('.')[0];
	} else {
		createdAtElement = new Date().toISOString().split('.')[0].slice(0, -3);
	}
</script>

{#if (isEditing || isCreating) && !isPreviewing}
	<span>
		<input type="datetime-local" max="9999-12-31T23:59" bind:value={createdAtElement} />
		{#if archivedAtElement}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="24px"
				viewBox="0 -960 960 960"
				width="24px"
				fill="#ACC1D2"
			>
				<path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
			</svg>
			<input type="datetime-local" max="9999-12-31T23:59" bind:value={archivedAtElement} />
		{/if}
	</span>
{:else if isPreviewing ? createdAt : createdAtElement}
	<span>
		{isPreviewing
			? moment(createdAtElement).format('MMMM D, YYYY [at] h:mm A')
			: moment(createdAt).format('MMMM D, YYYY [at] h:mm A')}
		{#if archivedAt || archivedAtElement}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="24px"
				viewBox="0 -960 960 960"
				width="24px"
				fill="#ACC1D2"
			>
				<path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
			</svg>
			{isPreviewing
				? moment(archivedAtElement).format('MMMM D, YYYY [at] h:mm A')
				: moment(archivedAt).format('MMMM D, YYYY [at] h:mm A')}
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
