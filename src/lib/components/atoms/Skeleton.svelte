<script lang="ts">
	interface Props {
		width?: string;
		height?: string;
		radius?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string;
		variant?: 'text' | 'title' | 'avatar' | 'button' | 'card' | 'image' | 'custom';
		class?: string;
		animate?: boolean;
	}

	let {
		width,
		height,
		radius = 'md',
		variant = 'text',
		class: className = '',
		animate = true
	}: Props = $props();

	const variantStyles = {
		text: { width: '100%', height: '1rem' },
		title: { width: '60%', height: '1.5rem' },
		avatar: { width: '3rem', height: '3rem', radius: 'full' },
		button: { width: '6rem', height: '2.5rem' },
		card: { width: '100%', height: '12rem' },
		image: { width: '100%', height: '10rem' },
		custom: { width: '100%', height: '1rem' }
	};

	const presetRadius = {
		none: '0',
		sm: '0.25rem',
		md: '0.5rem',
		lg: '1rem',
		full: '50%'
	};

	let resolvedWidth = $derived(width ?? variantStyles[variant].width);
	let resolvedHeight = $derived(height ?? variantStyles[variant].height);
	let resolvedRadius = $derived(() => {
		if (variant === 'avatar') return presetRadius.full;
		return radius;
	});
</script>

<div
	class="skeleton {animate ? 'skeleton--animate' : ''} {className}"
	style:width={resolvedWidth}
	style:height={resolvedHeight}
	style:border-radius={resolvedRadius()}
	aria-hidden="true"
></div>

<style>
	.skeleton {
		background: linear-gradient(
			90deg,
			var(--skeleton-base, var(--color-surface-100)) 0%,
			var(--skeleton-base, var(--color-surface-100)) 100%
		);
		background-size: 200% 100%;
	}

	.skeleton--animate {
		animation: skeleton-shimmer 1.5s ease-in-out infinite;
		background: linear-gradient(
			90deg,
			var(--skeleton-base, var(--color-surface-100)) 0%,
			var(--skeleton-highlight, var(--color-surface-200)) 50%,
			var(--skeleton-base, var(--color-surface-100)) 100%
		);
		background-size: 200% 100%;
	}

	@keyframes skeleton-shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}
</style>
