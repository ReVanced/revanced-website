<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import type { SpecialTargetValues } from '$types';

	type ButtonType = 'filled' | 'tonal' | 'text' | 'outlined';

	type Props = {
		type: ButtonType;
		icon?: Component;
		iconSize?: number;
		iconColor?: string;
		href?: string;
		target?: `${SpecialTargetValues}` | SpecialTargetValues;
		label?: string;
		children?: Snippet;
		onclick?: () => void;
	};

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
