<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import type { SpecialTargetValues, Prettify } from '$types';

	type ButtonType = 'filled' | 'tonal' | 'text' | 'outlined';

	type BaseProps = {
		type: ButtonType;
		icon?: Component;
		iconSize?: number;
		iconColor?: string;
		label?: string;
		children?: Snippet;
	};

	type ButtonProps = Prettify<
		BaseProps & {
			onclick: () => void;
			href?: never;
			target?: never;
		}
	>;

	type LinkProps = Prettify<
		BaseProps & {
			href: string;
			target?: `${SpecialTargetValues}` | SpecialTargetValues;
			onclick?: never;
		}
	>;

	type Props = ButtonProps | LinkProps;

	let {
		type,
		// https://svelte.dev/docs/svelte/compiler-warnings#svelte_component_deprecated
		icon: Icon,
		href,
		children,
		label = '',
		onclick = () => {},
		iconSize = 20,
		iconColor = 'currentColor',
		target = '_self'
	}: Props = $props();
</script>

{#if href}
	<a {href} {target} class={`button-${type}`} aria-label={label}>
		{#if Icon}
			<Icon size={iconSize} color={iconColor} />
		{/if}
		{@render children?.()}
	</a>
{:else}
	<button {onclick} class={`button-${type}`} aria-label={label}>
		{#if Icon}
			<Icon size={iconSize} color={iconColor} />
		{/if}
		{@render children?.()}
	</button>
{/if}

<style>
	button {
		border: none;
		background-color: transparent;
		padding: 0;
		margin: 0;
	}

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
	}

	.button-filled {
		background-color: var(--primary);
		color: var(--text-three);
	}
	.button-tonal {
		background-color: var(--surface-four);
	}

	.button-filled,
	.button-tonal {
		padding: 16px 24px;
	}

	.button-text {
		background-color: transparent;
		color: var(--primary);
		font-weight: 500;
		letter-spacing: 0.01rem;
	}

	button:hover,
	a:hover {
		filter: brightness(85%);
	}
</style>
