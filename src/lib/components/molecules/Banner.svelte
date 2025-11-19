<script lang="ts">
	import { slide } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import storable from '@madkarma/svelte-storable';
	import type { WithChildren } from '$types';
	import InfoIcon from 'virtual:icons/material-symbols/info-outline';
	import WarningIcon from 'virtual:icons/material-symbols/warning-outline';
	import ErrorIcon from 'virtual:icons/material-symbols/error-outline';
	import CloseIcon from 'virtual:icons/material-symbols/close';
	import { createEventDispatcher } from 'svelte';

	const readBannerIds = storable<string[]>('read_banner_ids', []);

	type BannerType = 'info' | 'warning' | 'error';

	type Props = {
		type: BannerType;
		id: string;
		permanent?: boolean;
		closed?: boolean;
		ariaLabelClose?: string;
	} & WithChildren;

	let {
		type,
		children,
		id,
		permanent = false,
		closed = $bindable($readBannerIds.includes(id)),
		ariaLabelClose = 'Dismiss banner'
	}: Props = $props();

	const dispatch = createEventDispatcher();

	const Icon = $derived(type === 'info' ? InfoIcon : type === 'warning' ? WarningIcon : ErrorIcon);
	let role = $derived(type === 'info' ? 'status' : 'alert');
	let ariaLive: 'polite' | 'assertive' = $derived(type === 'info' ? 'polite' : 'assertive');

	function dismiss() {
		closed = true;
		$readBannerIds = [...$readBannerIds, id];
		dispatch('close', { id });
	}
</script>

{#if !closed}
	<div
		class="banner {type}"
		{id}
		role={role}
		aria-live={ariaLive}
		data-type={type}
		transition:slide={{ duration: 180, easing: cubicInOut }}
	>
		<span class="icon" aria-hidden="true"><Icon /></span>
		<div class="content">{@render children()}</div>
		{#if !permanent}
			<button
				type="button"
				class="close"
				aria-label={ariaLabelClose}
				onclick={dismiss}
			>
				<span class="sr-only">{ariaLabelClose}</span>
				<CloseIcon aria-hidden="true" />
			</button>
		{/if}
	</div>
{/if}

<style>
		.banner {
			display: flex;
			align-items: flex-start;
			justify-content: flex-start;
			gap: var(--space-4);
			padding: var(--space-3) var(--space-6);
			position: sticky;
			top: 0;
			left: 0;
			z-index: var(--z-banner);
			border: 1px solid var(--color-border);
			background: var(--color-surface);
			color: var(--color-text);
			font-size: var(--font-size-sm);
		}

		.banner.info {
			border-color: var(--color-info);
			background: linear-gradient(
				to right,
				color-mix(in srgb, var(--color-info) 12%, var(--color-bg)),
				var(--color-surface)
			);
		}
		.banner.warning {
			border-color: var(--color-warning);
			background: linear-gradient(
				to right,
				color-mix(in srgb, var(--color-warning) 18%, var(--color-bg)),
				var(--color-surface)
			);
		}
		.banner.error {
			border-color: var(--color-danger);
			background: linear-gradient(
				to right,
				color-mix(in srgb, var(--color-danger) 14%, var(--color-bg)),
				var(--color-surface)
			);
		}

		.icon {
			width: 1.25rem;
			height: 1.25rem;
			flex-shrink: 0;
			display: inline-flex;
			align-items: center;
			justify-content: center;
		}

		.content {
			flex: 1;
			min-width: 0;
		}

		.close {
			background: transparent;
			border: none;
			color: var(--color-text-muted);
			cursor: pointer;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: var(--space-1);
			border-radius: var(--radius-1);
			transition: background-color .15s ease, color .15s ease;
		}
		.close:hover { background: var(--color-bg-alt); color: var(--color-text); }
		.close:focus-visible { outline: 2px solid var(--color-focus-ring); outline-offset: 2px; }

		@media (prefers-color-scheme: dark) {
			.banner { background: var(--color-bg-alt); }
			.banner.info { background: color-mix(in srgb, var(--color-info) 22%, var(--color-bg-alt)); }
			.banner.warning { background: color-mix(in srgb, var(--color-warning) 24%, var(--color-bg-alt)); }
			.banner.error { background: color-mix(in srgb, var(--color-danger) 20%, var(--color-bg-alt)); }
		}
</style>
