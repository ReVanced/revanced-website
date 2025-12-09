<script lang="ts">
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';
	import type { WithOptionalChildren } from '$types';


	type Props = {
		buttonStyle?: 'filled' | 'tonal' | 'text' | 'outlined' | 'icon';
		variant?: 'default' | 'danger' | 'onDangerBackground' | 'onInfoBackground';
		icon?: typeof import('virtual:icons/*').default;
		href?: string;
		target?: string;
		disabled?: boolean;
	} & WithOptionalChildren &
		Omit<HTMLButtonAttributes, 'disabled'> &
		Omit<HTMLAnchorAttributes, 'href' | 'target'>;

	let {
		buttonStyle = 'filled',
		variant = 'default',
		icon: Icon,
		href,
		target,
		disabled = false,
		children,
		class: klass = '',
		...rest
	}: Props = $props();

	let hasChildren = $derived(children !== undefined);
	let computedStyle = $derived(hasChildren ? buttonStyle : 'icon');
</script>

{#if href}
	<a
		{href}
		{target}
		class="{computedStyle} {variant} {klass}"
		class:disabled
		{...rest}
	>
		{#if Icon}
			<Icon />
		{/if}
		{#if children}
			<span class="content">{@render children()}</span>
		{/if}
	</a>
{:else}
	<button
		class="{computedStyle} {variant} {klass}"
		class:disabled
		{disabled}
		{...rest}
	>
		{#if Icon}
			<Icon />
		{/if}
		{#if children}
			<span class="content">{@render children()}</span>
		{/if}
	</button>
{/if}

<style>
	a,
	button {
		min-width: max-content;
		font-size: 0.95rem;
		text-decoration: none;
		color: var(--text-one);
		font-weight: 600;
		border: none;
		border-radius: 100px;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		transition:
			transform 0.4s var(--bezier-one),
			filter 0.4s var(--bezier-one);
		user-select: none;
		padding: 16px 24px;
		font-family: inherit;
	}

	a:hover:not(.disabled),
	button:hover:not(.disabled) {
		filter: brightness(85%);
	}

	.disabled {
		filter: grayscale(100%);
		cursor: not-allowed;
		pointer-events: none;
	}

	.filled {
		background-color: var(--primary);
		color: var(--text-three);
	}

	.tonal {
		background-color: var(--surface-four);
		color: var(--text-one);
	}

	.text {
		background-color: transparent;
		color: var(--primary);
		font-weight: 500;
		padding: 0;
	}

	.outlined {
		border: 2px solid var(--primary);
		background-color: transparent;
	}

	.icon {
		background-color: transparent;
		color: currentColor;
		padding: 0;
	}

	.icon:hover {
		filter: brightness(75%);
	}

	.danger {
		background-color: var(--red-one);
		color: var(--surface-four);
	}

	.onDangerBackground {
		background-color: #ffd3d3;
		color: #601410;
	}

	.onInfoBackground {
		background-color: #0d2d44;
		color: var(--accent-color);
	}

	.content {
		display: inline-block;
	}
</style>
