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
			href: never;
			target: never;
		}
	>;

	type LinkProps = Prettify<
		BaseProps & {
			href: string;
			target?: `${SpecialTargetValues}` | SpecialTargetValues;
			onclick: never;
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
	<a {href} {target} class:type aria-label={label}>
		{#if Icon}
			<Icon size={iconSize} color={iconColor} />
		{/if}
		{@render children?.()}
	</a>
{:else}
	<button {onclick} class:type aria-label={label}>
		{#if Icon}
			<Icon size={iconSize} color={iconColor} />
		{/if}
		{@render children?.()}
	</button>
{/if}
