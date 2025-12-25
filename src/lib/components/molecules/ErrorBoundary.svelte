<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$components/atoms/Button.svelte';

	interface Props {
		error?: Error | null;
		isError?: boolean;
		onRetry?: () => void;
		isRetrying?: boolean;
		title?: string;
		message?: string;
		compact?: boolean;
		children?: Snippet;
		fallback?: Snippet<[{ error: Error | null; retry: () => void }]>;
	}

	let {
		error = null,
		isError = false,
		onRetry,
		isRetrying = false,
		title = 'Something went wrong',
		message,
		compact = false,
		children,
		fallback
	}: Props = $props();

	let displayMessage = $derived(message ?? error?.message ?? 'An unexpected error occurred');
	let showError = $derived(isError || error !== null);

	function handleRetry() {
		onRetry?.();
	}
</script>

{#if showError}
	{#if fallback}
		{@render fallback({ error, retry: handleRetry })}
	{:else if compact}
		<div class="error-boundary error-boundary--compact">
			<span class="error-boundary__message">{displayMessage}</span>
			{#if onRetry}
				<Button buttonStyle="text" onclick={handleRetry} disabled={isRetrying}>
					{isRetrying ? 'Retrying...' : 'Retry'}
				</Button>
			{/if}
		</div>
	{:else}
		<div class="error-boundary">
			<div class="error-boundary__icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="12" cy="12" r="10" />
					<line x1="12" y1="8" x2="12" y2="12" />
					<line x1="12" y1="16" x2="12.01" y2="16" />
				</svg>
			</div>
			<h3 class="error-boundary__title">{title}</h3>
			<p class="error-boundary__message">{displayMessage}</p>
			{#if onRetry}
				<Button buttonStyle="tonal" onclick={handleRetry} disabled={isRetrying}>
					{isRetrying ? 'Retrying...' : 'Try again'}
				</Button>
			{/if}
		</div>
	{/if}
{:else if children}
	{@render children()}
{/if}

<style>
	.error-boundary {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 2rem;
		text-align: center;
		gap: 1rem;
		min-height: 200px;
	}

	.error-boundary--compact {
		flex-direction: row;
		padding: 1rem;
		min-height: auto;
		gap: 0.75rem;
		background: var(--color-error-50);
		border-radius: 0.5rem;
		border: 1px solid var(--color-error-200);
	}

	.error-boundary__icon {
		color: var(--color-error-500);
		opacity: 0.8;
	}

	.error-boundary__title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 0;
	}

	.error-boundary__message {
		color: var(--color-text-secondary);
		margin: 0;
		max-width: 40ch;
	}

	.error-boundary--compact .error-boundary__message {
		color: var(--color-error-700);
		flex: 1;
		text-align: left;
	}
</style>
