<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { WithChildren } from '$types';

	type Variant = 'filled' | 'tonal' | 'text' | 'outlined';

	type Props = {
		variant?: Variant;
		icon?: typeof import('virtual:icons/*').default;
		ariaLabel?: string; // explicit label when icon only
		loading?: boolean;
	} & WithChildren & HTMLButtonAttributes;

	let {
		variant = 'filled',
		icon: Icon,
		children,
		class: klass,
		ariaLabel,
		loading = false,
		...rest
	}: Props = $props();

	// Determine if there is textual content
	let hasContent = $derived(Boolean(children));

	$effect(() => {
		// Warn in dev if icon-only without aria-label
		if (Icon && !hasContent && !ariaLabel) {
			console.warn('[Button] Icon-only buttons need ariaLabel prop for accessibility');
		}
	});
</script>

<button
	{...rest}
	class="btn {variant} {loading ? 'loading' : ''} {klass}"
	data-variant={variant}
	aria-label={ariaLabel}
	disabled={loading || rest.disabled}
>
	{#if Icon}
		<span class="icon" aria-hidden="true"><Icon /></span>
	{/if}
	{#if hasContent}
		<span class="content">{@render children()}</span>
	{:else if loading}
		<span class="content" aria-live="polite">Loading…</span>
	{/if}
</button>

<style>
	button.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--btn-gap);
		padding: var(--btn-padding-y) var(--btn-padding-x);
		border-radius: var(--btn-radius);
		font-size: var(--btn-font-size);
		line-height: var(--line-height-tight);
		user-select: none;
		position: relative;
		transition: background-color .18s ease, color .18s ease, border-color .18s ease, box-shadow .18s ease;
		border: 1px solid transparent;
	}

	button.btn:disabled {
		opacity: .55;
		cursor: not-allowed;
	}

	/* Filled */
	button.btn.filled {
		background: var(--color-accent);
		color: var(--color-neutral-0);
		box-shadow: var(--shadow-1);
	}
	button.btn.filled:hover:not(:disabled) {
		background: var(--color-accent-hover);
	}
	button.btn.filled:active:not(:disabled) {
		background: var(--color-accent-active);
		box-shadow: var(--shadow-2);
	}

	/* Tonal */
	button.btn.tonal {
		background: var(--color-surface);
		color: var(--color-text);
		border-color: var(--color-border);
	}
	button.btn.tonal:hover:not(:disabled) {
		background: var(--color-bg-alt);
		border-color: var(--color-border-strong);
	}
	button.btn.tonal:active:not(:disabled) {
		background: var(--color-border);
	}

	/* Outlined */
	button.btn.outlined {
		background: transparent;
		color: var(--color-text);
		border-color: var(--color-border-strong);
	}
	button.btn.outlined:hover:not(:disabled) {
		background: var(--color-bg-alt);
	}
	button.btn.outlined:active:not(:disabled) {
		background: var(--color-border);
	}

	/* Text */
	button.btn.text {
		background: transparent;
		color: var(--color-text);
		padding: var(--space-2) var(--space-2);
		border-color: transparent;
	}
	button.btn.text:hover:not(:disabled) {
		background: var(--color-bg-alt);
	}
	button.btn.text:active:not(:disabled) {
		background: var(--color-border);
	}

	/* Loading state (simple overlay - minimal) */
	button.btn.loading {
		cursor: progress;
	}

	.icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		line-height: 0;
	}

	.content {
		display: inline-block;
		white-space: nowrap;
	}

	@media (prefers-reduced-motion: reduce) {
		button.btn { transition: none; }
	}
</style>
