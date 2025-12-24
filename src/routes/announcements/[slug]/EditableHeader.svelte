<script lang="ts" module>
	export type { TitleProps, AuthorProps, DateProps };

	type TitleProps = {
		isEditing: boolean;
		isPreviewing: boolean;
		title: string;
		titleInput: string;
	};

	type AuthorProps = {
		isEditing: boolean;
		isPreviewing: boolean;
		author: string | null;
		authorInput: string;
	};

	type DateProps = {
		isEditing: boolean;
		isPreviewing: boolean;
		createdAt: string;
		createdAtInput: string;
		archivedAt: string | null;
		archivedAtInput: string;
	};
</script>

<script lang="ts">
	import { relativeTime } from '$lib/utils/relativeTime';
	import IconArrowRight from 'svelte-material-icons/ArrowRight.svelte';
	import moment from 'moment';

	type Props = {
		field: 'title' | 'author' | 'date';
		isEditing: boolean;
		isPreviewing: boolean;
		title?: string;
		titleInput?: string;
		author?: string | null;
		authorInput?: string;
		createdAt?: string;
		createdAtInput?: string;
		archivedAt?: string | null;
		archivedAtInput?: string;
	};

	let {
		field,
		isEditing,
		isPreviewing,
		title = '',
		titleInput = $bindable(''),
		author = null,
		authorInput = $bindable(''),
		createdAt = '',
		createdAtInput = $bindable(''),
		archivedAt = null,
		archivedAtInput = $bindable('')
	}: Props = $props();

	let displayTitle = $derived(isPreviewing ? titleInput : title);
	let displayAuthor = $derived(isPreviewing ? authorInput : author);
	let displayCreatedAt = $derived(isPreviewing ? createdAtInput : createdAt);
	let displayArchivedAt = $derived.by(() => {
		const date = isPreviewing ? archivedAtInput : archivedAt;
		return date && moment(date).isBefore() ? date : null;
	});
</script>

{#if field === 'title'}
	{#if isEditing && !isPreviewing}
		<input
			type="text"
			bind:value={titleInput}
			class="title-input"
			class:empty={!titleInput?.trim()}
			placeholder="Enter title"
		/>
	{:else if displayTitle}
		<span class="title-text">{displayTitle}</span>
	{/if}
{:else if field === 'author'}
	{#if isEditing && !isPreviewing}
		·
		<input
			type="text"
			bind:value={authorInput}
			class="author-input"
			placeholder="Enter author name"
		/>
	{:else if displayAuthor}
		·
		<span class="author-text">{displayAuthor}</span>
	{/if}
{:else if field === 'date'}
	{#if isEditing && !isPreviewing}
		<span class="date-inputs">
			<input
				type="datetime-local"
				max="9999-12-31T23:59"
				bind:value={createdAtInput}
				class="date-input"
			/>
			{#if archivedAtInput}
				<IconArrowRight size={16} />
				<input
					type="datetime-local"
					max="9999-12-31T23:59"
					bind:value={archivedAtInput}
					class="date-input"
				/>
			{/if}
		</span>
	{:else if displayCreatedAt}
		<span class="date-display">
			{relativeTime(displayCreatedAt)}
			{#if displayArchivedAt}
				<IconArrowRight size={16} />
				{relativeTime(displayArchivedAt)}
			{/if}
		</span>
	{/if}
{/if}

<style>
	.title-input {
		width: 100%;
		padding: 0;
		border: none;
		outline: none;
		border-radius: 0;
		background-color: transparent;
		color: var(--text-one);
		font-size: 2.5rem;
		font-weight: 700;
		line-height: 4rem;
		letter-spacing: -0.025em;
		font-family: inherit;
	}

	.title-input:focus {
		border: none;
		outline: none;
	}


	.title-input::placeholder {
		color: var(--text-four);
		opacity: 0.6;
	}

	.title-text {
		font-size: 2.5rem;
		font-weight: 700;
		line-height: 4rem;
		letter-spacing: -0.025em;
		color: var(--text-one);
	}

	.author-input {
		padding: 0;
		border: none;
		outline: none;
		border-radius: 0;
		background-color: transparent;
		color: var(--secondary);
		font-size: 1rem;
		font-family: inherit;
		letter-spacing: 0.02rem;
		width: auto;
		min-width: 100px;
	}

	.author-input:focus {
		border: none;
		outline: none;
	}

	.author-input::placeholder {
		color: var(--text-four);
		opacity: 0.6;
	}

	.author-text {
		color: var(--text-one);
	}

	.date-inputs,
	.date-display {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		column-gap: 0.5rem;
	}

	.date-input {
		padding: 0;
		border: none;
		outline: none;
		border-radius: 0;
		background-color: transparent;
		color: var(--secondary);
		font-size: 1rem;
		font-family: inherit;
		letter-spacing: 0.02rem;
	}

	.date-input:focus {
		border: none;
		outline: none;
	}

	.date-input::-webkit-calendar-picker-indicator {
		filter: invert(88%) sepia(60%) saturate(4731%) hue-rotate(173deg) brightness(91%) contrast(111%);
	}

	.date-display :global(svg),
	.date-inputs :global(svg) {
		width: 20px;
		height: 20px;
		color: var(--text-four);
	}
</style>
