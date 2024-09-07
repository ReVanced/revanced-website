<script lang="ts">
	import { onMount } from 'svelte';

	export let backgroundImageUrl: string;
	export let foregroundImageUrl: string;
	export let alt: string;

	let showHeart: (e: MouseEvent, behind: boolean) => void = (_e, _behind) => {};

	onMount(() => {
		const background = document.getElementById('pulsating-image')!;

		let lastHeartTime = 0;

		showHeart = (e, behind) => {
			const rect = background.getBoundingClientRect();
			if (Date.now() - lastHeartTime < 100) return;
			lastHeartTime = Date.now();

			const heart = document.createElement('img');
			heart.src = foregroundImageUrl;
			heart.style.position = 'absolute';

			let x = e.clientX - rect.left - heart.width;
			let y = e.clientY - rect.top - heart.height;

			x += Math.floor(Math.random() * 30) - 15;
			y += Math.floor(Math.random() * 30) - 15;

			heart.style.left = `${x}px`;
			heart.style.top = `${y}px`;
			heart.style.height = '50px';
			heart.style.width = '50px';

			if (behind) heart.style.zIndex = '-1';

			const animations = [
				'float-up',
				'float-scale-rotate-left',
				'float-scale-rotate-right',
				'float-scale-rotate-right-2',
				'float-scale-rotate-left-2'
			];
			heart.classList.add(animations[Math.floor(Math.random() * animations.length)]);
			heart.classList.add('float');

			background.appendChild(heart);

			setTimeout(() => {
				heart.remove();
			}, 1000);
		};

		let interval: number | undefined;
		function showHeartRandom() {
			const rect = background.getBoundingClientRect();

			const x = rect.left + Math.floor(Math.random() * rect.width);
			const y = rect.top + Math.floor(Math.random() * rect.height);
			showHeart!({ clientX: x, clientY: y } as MouseEvent, true);

			interval = setTimeout(showHeartRandom, Math.random() * 300);
		}
		showHeartRandom();

		return () => clearTimeout(interval);
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	id="pulsating-image"
	on:mousemove={(e) => showHeart(e, false)}
	on:mousedown={(e) => showHeart(e, false)}
>
	<div id="pulsating-image-rotate">
		<div id="pulsating-image-hover">
			<div id="background" style:background-image="url({backgroundImageUrl})">
				<img id="heart-secondary" src={foregroundImageUrl} {alt} />
				<img id="heart-primary" src={foregroundImageUrl} {alt} />
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	:root {
		overflow-x: hidden;
	}

	:global(.float) {
		pointer-events: none;
		opacity: 0;
		filter: blur(0);
	}

	:global(.float-up) {
		animation: floatUp 1s ease-out forwards;
		@keyframes floatUp {
			0% {
				transform: translateY(0px);
			}
			50% {
				opacity: 0.3;
				filter: blur(0);
			}
			100% {
				transform: translateY(-40px);
				opacity: 0;
				filter: blur(5px);
			}
		}
	}

	:global(.float-scale-rotate-left) {
		animation: floatScaleRotateLeft 1s ease-out forwards;
		@keyframes floatScaleRotateLeft {
			0% {
				transform: translateY(0px) scale(1.2);
			}
			50% {
				opacity: 0.3;
				filter: blur(0);
			}
			100% {
				transform: translateY(-20px) scale(0.5) rotate(-45deg);
				opacity: 0;
				filter: blur(5px);
			}
		}
	}

	:global(.float-scale-rotate-right) {
		animation: floatScaleRotateRight 1s ease-out forwards;
		@keyframes floatScaleRotateRight {
			0% {
				transform: translateY(0px) scale(1.2);
			}
			50% {
				opacity: 0.3;
				filter: blur(0);
			}
			100% {
				transform: translateY(-20px) scale(0.5) rotate(45deg);
				opacity: 0;
				filter: blur(5px);
			}
		}
	}

	:global(.float-scale-rotate-right-2) {
		animation: floatScaleRotateRight2 1s ease-out forwards;
		@keyframes floatScaleRotateRight2 {
			0% {
				transform: translateY(0px) scale(1.8);
			}
			50% {
				opacity: 0.3;
				filter: blur(0);
			}
			100% {
				transform: translateY(-30px) scale(1) rotate(50deg);
				opacity: 0;
				filter: blur(5px);
			}
		}
	}

	:global(.float-scale-rotate-left-2) {
		animation: floatScaleRotateLeft2 1s ease-out forwards;
		@keyframes floatScaleRotateLeft2 {
			0% {
				transform: translateY(0px) scale(1.8);
				opacity: 0.3;
			}
			50% {
				opacity: 0.3;
				filter: blur(0);
			}
			100% {
				transform: translateY(-30px) scale(1) rotate(-50deg);
				opacity: 0;
				filter: blur(5px);
			}
		}
	}

	#pulsating-image {
		user-select: none;
		border-radius: 100%;
		cursor: pointer;
		filter: brightness(1);
		transition:
			transform 0.4s ease,
			filter 0.2s ease;
		&:hover {
			transform: scale(1.05);
		}

		&:active {
			filter: brightness(1.3);
			transform: scaleY(0.95) rotate(5deg);
		}

		#pulsating-image-rotate {
			animation: rotate 1.25s infinite;

			@keyframes rotate {
				32% {
					transform: rotate(-5deg);
				}
				50% {
					transform: rotate(4deg);
				}
				80% {
					transform: rotate(-3deg);
				}
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
					border-radius: 100%;
					box-shadow: 0 0 0 1rem black;
					pointer-events: none;
					display: flex;
					background-repeat: no-repeat;
					justify-content: center;
					align-items: center;
					animation: pulse-size 1.25s infinite;
					will-change: transform;
					height: 100%;
					width: 100%;

					#heart-secondary {
						animation: pulse-fade 1.25s infinite ease-out;
						opacity: 0.5;
						will-change: transform, filter;
						filter: opacity(0);
						transform: scale(0.8);

						@keyframes pulse-fade {
							30% {
								transform: scale(0.7);
								filter: blur(0rem) opacity(0.7);
							}
							100% {
								transform: scale(1.8);
								filter: blur(1rem) opacity(0);
							}
						}
					}
					#heart-primary {
						animation:
							double-pulse-size 1.25s infinite,
							pulse-glow 1.25s infinite;
						@keyframes double-pulse-size {
							0% {
								transform: scale(0.7) rotate(0);
							}
							13% {
								transform: scale(0.84);
							}
							16% {
								transform: scale(0.82);
							}
							30% {
								transform: scale(0.7);
							}
							50% {
								transform: scale(0.8);
							}

							100% {
								transform: scale(0.7);
							}
						}

						& {
							filter: drop-shadow(0 0 0 var(--red-one));
						}

						@keyframes pulse-glow {
							33% {
								filter: drop-shadow(0 0 0rem var(--red-one));
							}
							45% {
								filter: drop-shadow(0 0 0.5rem var(--red-one));
							}
							80% {
								filter: drop-shadow(0 0 0.5rem var(--red-one));
							}
						}
					}
					#heart-primary,
					#heart-secondary {
						position: absolute;
						height: 50%;
						will-change: transform, box-shadow;
					}

					& {
						box-shadow: 0 0 0 0 #000000;
					}

					@keyframes pulse-size {
						0% {
							transform: scale(0.7);
							filter: brightness(1);
						}
						32% {
							box-shadow: 0 0 50px 3px #000000;
							transform: scale(0.64) scaleY(0.95);
						}
						38% {
							box-shadow: 0 0 0 0 #000000;
							filter: brightness(1.2);
						}
						50% {
							transform: scale(0.78);
						}
						100% {
							box-shadow: 0 0 0 0 #000000;
							filter: brightness(1);
							transform: scale(0.7);
						}
					}
				}
			}
		}
	}
</style>
