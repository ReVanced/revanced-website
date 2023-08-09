<script lang="ts">
	export let backgroundImageUrl: string;
	export let foregroundImageUrl: string;
	export let alt: string;
</script>

<div id="pulsating-image">
	<div
		id="background"
		style:background-image="url({backgroundImageUrl})"
	>
		<img src={foregroundImageUrl} {alt} />
	</div>
</div>

<style lang="scss">
	#pulsating-image {
		user-select: none;
		cursor: pointer;
		transition: all 0.2s ease;
		height: 225px;
		width: 225px;

		&:hover {
			transform: scale(1.05) rotate(5deg);
		}

		&:active {
			filter: brightness(1.4);
			transform: scaleY(0.97) rotate(-5deg);
		}
	}
	#background {
		display: flex;
		background-repeat: no-repeat;
		justify-content: center;
		align-items: center;
		animation: pulse-size 1.2s infinite;
		will-change: transform;
		height: 100%;
		width: 100%;

		img {
			height: 50%;
			animation: double-pulse-size 1.2s infinite, pulse-glow 1.2s infinite;
			will-change: transform, box-shadow;

			@keyframes double-pulse-size {
				0% {
					transform: scale(0.7);
				}
				13% {
					transform: scale(0.8);
				}
				30% {
					transform: scale(0.7);
				}
				45% {
					transform: scale(0.8);
				}
				100% {
					transform: scale(0.7);
				}
			}

			@keyframes pulse-glow {
				30% {
					filter: drop-shadow(0 0 0rem var(--red-one));
				}
				45% {
					filter: drop-shadow(0 0 0.5rem var(--red-one));
				}
			}
		}

		@keyframes pulse-size {
			0% {
				transform: scale(0.7);
			}
			30% {
				filter: brightness(1);
			}
			39% {
				filter: brightness(1.2);
			}
			32% {
				transform: scale(0.68);
			}
			50% {
				transform: scale(0.78);
			}
			100% {
				transform: scale(0.7);
			}
		}
	}
</style>
