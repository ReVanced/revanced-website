<script lang="ts">
	export let imageUrls: string[];

	let slideIndex: number = 1;

	function plusSlides(n: number) {
		showSlides((slideIndex += n));
	}

	function currentSlide(n: number) {
		showSlides((slideIndex = n));
	}

	function showSlides(n: number) {
		if (n > imageUrls.length) slideIndex = 1;
		else if (n < 1) slideIndex = imageUrls.length;
		else slideIndex = n;
	}

	showSlides(slideIndex);

	$: console.log('Slide index:', slideIndex);
</script>

<div class="container">
	{#each imageUrls as url, i (i)}
		<div class="mySlides" class:active={slideIndex === i + 1}>
			<div class="numbertext">{i + 1} / {imageUrls.length}</div>
			<img src={url} alt="Gallery image {i + 1}" style="width: 100%" />
		</div>
	{/each}

	<button class="prev" on:click={() => plusSlides(-1)}>❮</button>
	<button class="next" on:click={() => plusSlides(1)}>❯</button>

	<div class="row">
		{#each imageUrls as url, i (i)}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="column" on:click={() => currentSlide(i + 1)}>
				<img
					class="demo cursor"
					class:active={slideIndex === i + 1}
					src={url}
					style="width: 100%"
					alt="Gallery image {i + 1}"
				/>
			</div>
		{/each}
	</div>
</div>

<style>
	img {
		vertical-align: middle;
	}

	/* FIXME: */
	/* Position the image container (needed to position the left and right arrows) */
	.container {
		position: relative;
	}

	.mySlides {
		display: none;
	}

	.mySlides.active {
		display: block;
	}

	.cursor {
		cursor: pointer;
	}

	/* Next & previous buttons */
	.prev,
	.next {
		cursor: pointer;
		position: absolute;
		top: 40%;
		width: auto;
		padding: 16px;
		margin-top: -50px;
		color: white;
		font-weight: bold;
		font-size: 20px;
		border-radius: 0 3px 3px 0;
		user-select: none;
		-webkit-user-select: none;
	}

	/* Position the "next button" to the right */
	.next {
		right: 0;
		border-radius: 3px 0 0 3px;
	}

	.prev:hover,
	.next:hover {
		background-color: rgba(0, 0, 0, 0.8);
	}

	.numbertext {
		color: #f2f2f2;
		font-size: 12px;
		padding: 8px 12px;
		position: absolute;
		top: 0;
	}

	.row:after {
		content: '';
		display: table;
		clear: both;
	}

	/* FIXME: */
	.column {
		float: left;
		width: 16.66%;
	}

	.demo {
		opacity: 0.6;
	}

	.demo.active,
	.demo:hover {
		opacity: 1;
	}
</style>
