<script>
</script>

<div class="hero-img">
	<img 
		src="/manager.png" 
		alt="Screenshot of ReVanced Manager" 
	/>
</div>

<style>
	img {
		height: 100%;
	}
	.hero-img {
		overflow: hidden;
		height: 70vh;
		max-height: 70rem;
		z-index: -1;
		width: auto;
		float: right;
		border-radius: 2rem;
		transform: rotate(3.7deg);
		box-shadow: 0 1rem 5rem 0 #0f111ad4;
		user-select: none;
	}
	@media (max-width: 1700px) {
		.hero-img {
			border-radius: 3vh;
			position: fixed;
			height: 90vh;
			top: 90px;
			right: 7.5%;
			transform: rotate(3.7deg) translateY(5%);
		}
	}
</style>
