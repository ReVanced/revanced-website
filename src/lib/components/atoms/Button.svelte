<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { WithChildren } from '$types';

	type Props = {
		buttonStyle: 'filled' | 'tonal' | 'text' | 'outlined';
		icon?: typeof import('virtual:icons/*').default;
	} & WithChildren &
		HTMLButtonAttributes;
	let { buttonStyle, icon: Icon, children, class: klass, ...rest }: Props = $props();
</script>

<button class="{buttonStyle} {klass}" {...rest}>
	{#if Icon}
		<Icon />
	{/if}
	<span class="content">
		{@render children()}
	</span>
</button>

<style>
	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 1rem 1.5rem;
		border-radius: 9999px;
		cursor: pointer;
	}

	button:hover {
	}

	.content {
		display: inline-block;
	}
</style>
