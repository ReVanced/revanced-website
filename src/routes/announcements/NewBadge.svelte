<script lang="ts">
	import { onMount } from 'svelte';

	type Corner = { y: 'top' | 'bottom'; x: 'left' | 'right' };

	export let animated: boolean = false;
	export let corner: Corner = { y: 'top', x: 'right' };

	let self: HTMLElement;

	onMount(() => {
		self.parentElement!.style.position = 'relative';
	});
</script>

<span class="new-badge {corner.y} {corner.x}" class:animated bind:this={self}>NEW</span>

<style>
	.new-badge {
		background-color: var(--primary);
		color: var(--surface-two);
		font-size: 0.75rem;
		font-weight: bold;
		padding: 2px 6px;
		border-radius: 4px;
		pointer-events: none;
		position: absolute;
		z-index: 10;
		transform: translate(40%, -40%);
		letter-spacing: 0.05em;
	}

	.new-badge.top {
		top: 0;
	}

	.new-badge.bottom {
		bottom: 0;
	}

	.new-badge.left {
		left: 0;
	}

	.new-badge.right {
		right: 0;
	}

	.new-badge.animated {
		animation: pulse 1.5s linear infinite;
	}

	@keyframes pulse {
		0% {
			transform: scale(1) translate(40%, -40%);
		}
		50% {
			transform: scale(1.2) translate(32%, -32%);
		}
		100% {
			transform: scale(1) translate(40%, -40%);
		}
	}
</style>
