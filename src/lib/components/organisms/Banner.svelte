<script lang="ts">
	import Info from '~icons/mdi/information-outline';
	import Warning from '~icons/mdi/alert-outline';
	import Caution from '~icons/mdi/alert-circle-outline';
	import Close from '~icons/mdi/close';
	import { slide } from 'svelte/transition';

	import type { Snippet } from 'svelte';
	import Button from '$components/atoms/Button.svelte';

	type BaseProps = {
		children: Snippet;
		level: 'info' | 'warning' | 'caution';
	};

	type NonPermanentProps = BaseProps & {
		permanent?: false;
		onDismiss?: () => void;
	};

	type PermanentProps = BaseProps & {
		permanent: true;
		onDismiss?: never; // permanent banner doesn't have a dismiss button
	};

	type Props = NonPermanentProps | PermanentProps;
	let { children, level = 'info', permanent = false, onDismiss }: Props = $props();

	const icons = { info: Info, warning: Warning, caution: Caution };
	const Icon = icons[level];
	const dismissButtonColor = level === 'info' ? 'var(--text-one)' : '#000';

	let closed = $state(!permanent);

	if (!permanent)
		$effect(() => {
			setTimeout(() => {
				closed = false;
			}, 1); // trigger the in transition
		});

	const dismissBanner = () => {
		closed = true;
		onDismiss?.();
	};
</script>

{#if permanent}
	<div class="banner-container permanent">
		<div class="banner {level}">
			<div class="banner-text">
				<Icon width={24} height={24} />
				{@render children()}
			</div>
		</div>
	</div>
{:else if !closed}
	<div class="banner-container" transition:slide={{ duration: 300, axis: 'y' }}>
		<div class="banner {level}">
			<div class="banner-text">
				<Icon width={32} height={32} />
				{@render children()}
			</div>
			<Button
				type="text"
				icon={Close}
				onclick={dismissBanner}
				iconColor={dismissButtonColor}
				color={dismissButtonColor}
			>
				Dismiss
			</Button>
		</div>
	</div>
{/if}

<style>
	.banner-container,
	.banner-container *,
	.banner-container :global(*) {
		transition: none;
	}

	.banner-text :global(a) {
		color: inherit;
		text-decoration: none;
		font-weight: 700;
	}

	.banner-text :global(a:hover) {
		text-decoration: underline;
	}

	.banner-container {
		display: flex;
		justify-content: center;
		width: 100%;
		/* optional: to prevent content spill during transition */
	}

	.permanent {
		font-size: 0.87rem;
	}

	.banner {
		margin: 0;
		padding: 1.5rem 1.7rem;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.3rem;
		margin: 0.7rem 1rem;
		border-radius: 1rem;
	}

	.permanent > .banner {
		padding: 0.5rem 0.7rem;
		margin: 0;
		border-radius: 0;
		width: 100%;
	}

	.banner-text {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		gap: 0.55rem;
		word-wrap: break-word;
	}

	.banner.info {
		background-color: var(--surface-four);
		color: var(--text-one);
	}

	.banner.warning {
		background-color: var(--yellow-one);
		color: #000;
	}

	.banner.caution {
		background-color: var(--red-two);
		color: #000;
	}

	@media screen and (max-width: 767px) {
		.banner {
			flex-direction: column;
			padding: 1.1rem 1.3rem;
		}

		.banner > :global(button) {
			align-self: flex-end;
		}
	}
</style>
