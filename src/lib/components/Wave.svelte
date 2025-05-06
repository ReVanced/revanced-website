<script>
	export let visibility = true;
</script>

<svg
	class="wave"
	viewBox="0 0 1440 500"
	xmlns="http://www.w3.org/2000/svg"
	preserveAspectRatio="none"
	style="opacity: {visibility ? '100%' : '0'}"
>
	<path class="wave" />
</svg>

<style>
	svg {
		transition: opacity 0.1s var(--bezier-one);
		position: absolute;
		bottom: 0rem;
		z-index: -1;
		width: 100%;
		height: 40vh;
	}

	@media screen and (max-height: 820px) {
		svg {
			opacity: 0 !important;
		}
	}

	.wave {
		animation: wave-anim 30s;
		animation-timing-function: cubic-bezier(0.5, 0, 0.5, 1);
		animation-iteration-count: infinite;
		fill: var(--primary);
	}

	@keyframes wave-anim {
		0% {
			d: path(
				'M0 500C0 500 0 250 0 250 176.5333 300.1333 353.0667 350.2667 496 325 638.9333 299.7333 748.2667 199.0667 900 174 1051.7333 148.9333 1245.8667 199.4667 1440 250 1440 250 1440 500 1440 500Z'
			);
		}
		25% {
			d: path(
				'M0 500C0 500 0 250 0 250 154.1333 219.2 308.2667 188.4 449 209 589.7333 229.6 717.0667 301.6 880 317 1042.9333 332.4 1241.4667 291.2 1440 250 1440 250 1440 500 1440 500Z'
			);
		}
		50% {
			d: path(
				'M0 500C0 500 0 250 0 250 132.8 242.9333 265.6 235.8667 414 246 562.4 256.1333 726.4 283.4667 900 287 1073.6 290.5333 1256.8 270.2667 1440 250 1440 250 1440 500 1440 500Z'
			);
		}
		75% {
			d: path(
				'M0 500C0 500 0 250 0 250 151.3333 206.6667 302.6667 163.3333 472 176 641.3333 188.6667 828.6667 257.3333 993 279 1157.3333 300.6667 1298.6667 275.3333 1440 250 1440 250 1440 500 1440 500Z'
			);
		}
		100% {
			d: path(
				'M0 500C0 500 0 250 0 250 176.5333 300.1333 353.0667 350.2667 496 325 638.9333 299.7333 748.2667 199.0667 900 174 1051.7333 148.9333 1245.8667 199.4667 1440 250 1440 250 1440 500 1440 500Z'
			);
		}
	}
</style>
