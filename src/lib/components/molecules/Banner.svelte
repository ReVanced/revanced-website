<script lang="ts">
	import { slide } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import storable from '@madkarma/svelte-storable';
	import type { WithChildren } from '$types';
	import Info from 'virtual:icons/material-symbols/info-outline';
	import Warning from 'virtual:icons/material-symbols/warning-outline';
	import Error from 'virtual:icons/material-symbols/error-outline';
	import Close from 'virtual:icons/material-symbols/close';

	const readBannerIds = storable<string[]>('read_banner_ids', []);

	type Props = {
		type: 'info' | 'warning' | 'error';
		id: string;
		permanent?: boolean;
		closed?: boolean;
	} & WithChildren;
	let {
		type,
		children,
		id,
		permanent = false,
		closed = $bindable($readBannerIds.includes(id))
	}: Props = $props();

	const Icon = type === 'info' ? Info : type === 'warning' ? Warning : Error;
</script>

{#if !closed}
	<div class="banner {type}" {id} transition:slide={{ duration: 200, easing: cubicInOut }}>
		<Icon />

		<div class="content">
			{@render children()}
		</div>

		{#if !permanent}
			<button
				class="close"
				type="button"
				onclick={() => {
					closed = true;
					$readBannerIds = [...$readBannerIds, id];
				}}
			>
				<Close />
			</button>
		{/if}
	</div>
{/if}

<style>
	.banner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 2rem;
		position: sticky;
		top: 0;
		left: 0;
		z-index: 9998;

		&.info {
		}

		&.warning {
		}

		&.error {
		}
	}

	.content {
		flex: 1;
	}
</style>
