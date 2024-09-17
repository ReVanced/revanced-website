<script lang="ts">
	type Corner = { y: 'top' | 'bottom'; x: 'left' | 'right' };

	export let animated: boolean = false;
	export let corner: Corner = { y: 'top', x: 'right' };
</script>

<span class="unread-marker {corner.y} {corner.x}" class:animated />

<style>
	.unread-marker {
		background-color: var(--red-one);
		border-radius: 50%;
		width: 1rem;
		height: 1rem;
		pointer-events: none;
		position: relative;
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
			transform: scale(1);
		}
		50% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
