<script lang="ts">
	export let backgroundImageUrl: string;
	export let foregroundImageUrl: string;
	export let alt: string;

	export let size: number = 400;
</script>

<div
	id="background"
	style:background-image="url({backgroundImageUrl})"
	style:height={size + 'px'}
	style:width={size + 'px'}
>
	<img src={foregroundImageUrl} />
</div>

<style lang="scss">
	#background {
		display: flex;
		background-repeat: no-repeat;
		justify-content: center;
		align-items: center;
		animation: pulse-size 1.2s infinite;
		will-change: transform;
		img {
			height: 50%;
			animation: pulse-size 0.6s infinite, pulse-glow 1.2s infinite;
			will-change: transform, box-shadow;
		}

		@keyframes pulse-size {
			0% {
				transform: scale(0.7);
			}
			15% {
				transform: scale(0.8);
			}
			100% {
				transform: scale(0.7);
			}
		}

		@keyframes pulse-glow {
			0% {
				filter: drop-shadow(0 0 0rem var(--red-one));
			}
			15% {
				filter: drop-shadow(0 0 0.5rem var(--red-one));
			}
			30% {
				filter: drop-shadow(0 0 0.5rem var(--red-one));
			}
			100% {
				filter: drop-shadow(0 0 0rem var(--red-one));
			}
		}
	}
</style>
