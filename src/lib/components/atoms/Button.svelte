<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { WithChildren } from '$types';

	type Props = {
		buttonStyle: 'filled' | 'tonal' | 'text' | 'outlined';
		icon?: typeof import('virtual:icons/*').default;
	} & WithChildren &
		HTMLButtonAttributes;
	let { buttonStyle, icon: Icon, children, class: klass = '', ...rest }: Props = $props();
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
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		cursor: pointer;
		font-family: inherit;
		font-weight: 500;
		transition: all 0.2s ease-in-out;
		border: 1px solid transparent;
	}

	.filled {
		background-color: var(--nav-btn-active-bg);
		color: var(--nav-btn-active-color);
	}

	.filled:hover {
		background-color: var(--nav-btn-hover-bg);
	}

	.text {
		background-color: transparent;
		color: inherit;
	}

	.text:hover {
		opacity: 0.8;
	}

	.text:active {
		opacity: 0.6;
	}

	.content {
		display: inline-block;
	}
</style>
