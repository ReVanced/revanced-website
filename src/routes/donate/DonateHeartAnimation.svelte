<script lang="ts">
	export let backgroundImageUrl: string;
	export let foregroundImageUrl: string;
	export let alt: string;
</script>

<div id="pulsating-image-scale">
	<div id="pulsating-image-hover">
		<div id="background" style:background-image="url({backgroundImageUrl})">
			<img src={foregroundImageUrl} {alt} />
		</div>
	</div>
</div>

<style lang="scss">
	#pulsating-image-scale {
		user-select: none;
		cursor: pointer;

		transition:
			transform 0.4s ease,
			filter 0.2s ease;
		&:hover {
			transform: scale(1.05);
		}

		&:active {
			filter: brightness(1.3);
			transform: scaleY(0.95) rotate(-5deg);
		}

		#pulsating-image-hover {
			height: 225px;
			width: 225px;
			transition: all 0.2s ease;

			&:hover {
				animation: wiggle 1s;

				@keyframes wiggle {
					0% {
						transform: rotate(0);
					}
					25% {
						transform: rotate(5deg);
					}
					50% {
						transform: rotate(-5deg);
					}
					75% {
						transform: rotate(5deg);
					}
					100% {
						transform: rotate(0deg);
					}
				}
			}

			#background {
				pointer-events: none;
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
					animation:
						double-pulse-size 1.2s infinite,
						pulse-glow 1.2s infinite;
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
		}
	}
</style>
