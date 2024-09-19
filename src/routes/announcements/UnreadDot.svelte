<script lang="ts">
	import { onMount } from 'svelte';

	type Corner = { y: 'top' | 'bottom'; x: 'left' | 'right' };

	export let animated: boolean = false;
	export let corner: Corner = { y: 'top', x: 'right' };

	let self: HTMLElement;

	onMount(() => {
		// doing this here because we don't want to change the position attribute of the parent element when the component is not present in it
		self.parentElement!.style.position = 'relative';
	});
</script>

<span class="unread-marker {corner.y} {corner.x}" class:animated bind:this={self} />

<style>
	.unread-marker {
		background-color: var(--red-one);
		border-radius: 50%;
		width: 1rem;
		height: 1rem;
		pointer-events: none;
		position: absolute;
		z-index: 10;
		transform: translate(40%, -40%);
	}

	.unread-marker.top {
		top: 0;
	}

	.unread-marker.bottom {
		bottom: 0;
	}

	.unread-marker.left {
		left: 0;
	}

	.unread-marker.right {
		right: 0;
	}

	.unread-marker.animated {
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
