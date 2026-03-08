<script lang="ts">
	import { browser } from '$app/environment';

	type Props = {
		backgroundImageUrl: string;
		foregroundImageUrl: string;
		alt: string;
	};

	let { backgroundImageUrl, foregroundImageUrl, alt }: Props = $props();

	let container: HTMLDivElement | null = $state(null);
	let lastHeartTime = 0;

	function showHeart(e: MouseEvent, behind: boolean) {
		if (!browser || !container) return;

		const rect = container.getBoundingClientRect();
		if (Date.now() - lastHeartTime < 100) return;
		lastHeartTime = Date.now();

		const heart = document.createElement('img');
		heart.src = foregroundImageUrl;
		heart.alt = '';
		heart.style.position = 'absolute';
		heart.style.pointerEvents = 'none';
		heart.style.height = '50px';
		heart.style.width = '50px';

		let x = e.clientX - rect.left - 25;
		let y = e.clientY - rect.top - 25;

		x += Math.floor(Math.random() * 30) - 15;
		y += Math.floor(Math.random() * 30) - 15;

		heart.style.left = `${x}px`;
		heart.style.top = `${y}px`;

		if (behind) heart.style.zIndex = '-1';

		const animations = ['float-up', 'float-left', 'float-right'];
		const randomAnim = animations[Math.floor(Math.random() * animations.length)];
		heart.classList.add('floating-heart', randomAnim);

		container.appendChild(heart);

		setTimeout(() => heart.remove(), 1000);
	}

	$effect(() => {
		if (!browser || !container) return;

		let timeout: ReturnType<typeof setTimeout>;

		function spawnRandomHeart() {
			if (!container) return;
			const rect = container.getBoundingClientRect();
			const x = rect.left + Math.floor(Math.random() * rect.width);
			const y = rect.top + Math.floor(Math.random() * rect.height);
			showHeart({ clientX: x, clientY: y } as MouseEvent, true);
			timeout = setTimeout(spawnRandomHeart, Math.random() * 400 + 200);
		}

		spawnRandomHeart();

		return () => clearTimeout(timeout);
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	class="heart-container"
	bind:this={container}
	role="img"
	aria-label={alt}
	onmousemove={(e) => showHeart(e, false)}
	onmousedown={(e) => showHeart(e, false)}
>
	<div class="heart-rotate">
		<div class="heart-hover">
			<div class="background">
				<img class="ring-image" src={backgroundImageUrl} alt="" />
				<img class="heart-secondary" src={foregroundImageUrl} alt="" />
				<img class="heart-primary" src={foregroundImageUrl} {alt} />
			</div>
		</div>
	</div>
</div>

<style>
	:global(.floating-heart) {
		opacity: 0;
		filter: blur(0);
		animation-duration: 1s;
		animation-timing-function: ease-out;
		animation-fill-mode: forwards;
	}

	:global(.float-up) {
		animation-name: floatUp;
	}

	:global(.float-left) {
		animation-name: floatLeft;
	}

	:global(.float-right) {
		animation-name: floatRight;
	}

	@keyframes floatUp {
		0% {
			transform: translateY(0) scale(1.2);
			opacity: 0.4;
		}
		100% {
			transform: translateY(-40px) scale(0.5);
			opacity: 0;
			filter: blur(5px);
		}
	}

	@keyframes floatLeft {
		0% {
			transform: translateY(0) scale(1.2);
			opacity: 0.4;
		}
		100% {
			transform: translate(-20px, -30px) scale(0.5) rotate(-45deg);
			opacity: 0;
			filter: blur(5px);
		}
	}

	@keyframes floatRight {
		0% {
			transform: translateY(0) scale(1.2);
			opacity: 0.4;
		}
		100% {
			transform: translate(20px, -30px) scale(0.5) rotate(45deg);
			opacity: 0;
			filter: blur(5px);
		}
	}

	.heart-container {
		user-select: none;
		border-radius: 100%;
		cursor: pointer;
		filter: brightness(1);
		transition:
			transform 0.4s ease,
			filter 0.2s ease;
		position: relative;
	}

	.heart-container:hover {
		transform: scale(1.05);
	}

	.heart-container:active {
		filter: brightness(1.3);
		transform: scaleY(0.95) rotate(5deg);
	}

	.heart-rotate {
		animation: rotate 1.25s infinite;
	}

	@keyframes rotate {
		32% { transform: rotate(-5deg); }
		50% { transform: rotate(4deg); }
		80% { transform: rotate(-3deg); }
	}

	.heart-hover {
		height: 225px;
		width: 225px;
		transition: all 0.2s ease;
	}

	.heart-hover:hover {
		animation: wiggle 1s;
	}

	@keyframes wiggle {
		0% { transform: rotate(0); }
		25% { transform: rotate(5deg); }
		50% { transform: rotate(-5deg); }
		75% { transform: rotate(5deg); }
		100% { transform: rotate(0deg); }
	}

	.background {
		pointer-events: none;
		display: flex;
		justify-content: center;
		align-items: center;
		animation: pulseSize 1.25s infinite;
		will-change: transform;
		height: 100%;
		width: 100%;
		position: relative;
	}

	.ring-image {
		position: absolute;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	@keyframes pulseSize {
		0% {
			transform: scale(0.7);
			filter: brightness(1);
		}
		32% {
			transform: scale(0.64) scaleY(0.95);
		}
		38% {
			filter: brightness(1.2);
		}
		50% {
			transform: scale(0.78);
		}
		100% {
			filter: brightness(1);
			transform: scale(0.7);
		}
	}

	.heart-primary,
	.heart-secondary {
		position: absolute;
		height: 50%;
		will-change: transform, box-shadow;
	}

	.heart-secondary {
		animation: pulseFade 1.25s infinite ease-out;
		opacity: 0.5;
		will-change: transform, filter;
		filter: opacity(0);
		transform: scale(0.8);
	}

	@keyframes pulseFade {
		30% {
			transform: scale(0.7);
			filter: blur(0rem) opacity(0.7);
		}
		100% {
			transform: scale(1.8);
			filter: blur(1rem) opacity(0);
		}
	}

	.heart-primary {
		animation:
			doublePulseSize 1.25s infinite,
			pulseGlow 1.25s infinite;
		filter: drop-shadow(0 0 0 var(--red-one, #ff4444));
	}

	@keyframes doublePulseSize {
		0% { transform: scale(0.7) rotate(0); }
		13% { transform: scale(0.84); }
		16% { transform: scale(0.82); }
		30% { transform: scale(0.7); }
		50% { transform: scale(0.8); }
		100% { transform: scale(0.7); }
	}

	@keyframes pulseGlow {
		33% { filter: drop-shadow(0 0 0rem var(--red-one, #ff4444)); }
		45% { filter: drop-shadow(0 0 0.5rem var(--red-one, #ff4444)); }
		80% { filter: drop-shadow(0 0 0.5rem var(--red-one, #ff4444)); }
	}
</style>
