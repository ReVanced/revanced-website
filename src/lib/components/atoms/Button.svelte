<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import type { SpecialTargetValues, Prettify } from '$types';

	type ButtonType = 'filled' | 'tonal' | 'text' | 'outlined' | 'navbar';

	type BaseProps = {
		type: ButtonType;
		icon?: typeof import('~icons/mdi').default;
		iconColor?: string;
		color?: string;
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
		iconColor = 'currentColor',
		color = 'currentColor',
		target = '_self'
	}: Props = $props();

	// prettier-ignore
	const navBarButtonSelected = type === 'navbar' && href && new URL(href, page.url.href).pathname === page.url.pathname;
</script>

<!-- reusable snippet to remove duplicate code -->
{#snippet content()}
	{#if Icon}
		<Icon color={iconColor} />
	{/if}
	<span class="content" style="color: {color};">{@render children?.()}</span>
{/snippet}

{#if href}
	<a
		{href}
		{target}
		class={`button-${type}${navBarButtonSelected ? ' selected' : ''}`}
		aria-label={label}
	>
		{@render content()}
	</a>
{:else}
	<button {onclick} class={`button-${type}`} aria-label={label}>
		{@render content()}
	</button>
{/if}

<style>
	a,
	button {
		background-color: transparent;
		padding: 0;
		margin: 0;
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
		transition: all 0.4s var(--bezier-one);
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

	.button-text:hover .content {
		text-decoration: underline;
		text-decoration-color: currentColor;
	}

	button:not(.button-navbar):hover,
	a:not(.button-navbar):hover {
		filter: brightness(85%);
	}

	.button-navbar {
		transition-duration: 0.25s;
		text-decoration: none;
		user-select: none;
		border-radius: 10px;
		align-items: center;
		justify-content: center;
		padding: 10px 16px;
	}

	.button-navbar > span {
		font-weight: 400;
		font-size: 0.9rem;
		letter-spacing: 0.02rem;
		color: var(--text-four);
	}

	.button-navbar:hover {
		color: var(--text-one);
		background-color: var(--surface-three);
	}

	.button-navbar.selected {
		background-color: var(--tertiary);
		color: var(--primary);
		pointer-events: none;
	}

	.button-navbar.selected > span {
		color: var(--primary);
	}

	/* @media (max-width: 767px) {
		li {
			border-radius: 100px;
		}
		a {
			padding: 0.75rem 1.25rem;
			justify-content: left;
		}
		span {
			font-size: 1rem;
			font-weight: 500;
		}
	} */
</style>
