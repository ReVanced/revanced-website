<script>
  import Picture from './Picture.svelte';
  import manager_screenshot from '$images/manager_two.png?w=1233;822;411&format=avif;webp;png&picture';
</script>

<div class="hero-img">
  <Picture data={manager_screenshot} alt="Screenshot of ReVanced Manager" />
</div>

<style>
  .hero-img :global(img) {
	  height: 100%;
	  border-radius: 2rem;
  }

	.hero-img {
		overflow: hidden;
		height: 70vh;
		max-height: 70rem;
		z-index: -1;
		width: auto;
		float: right;
		padding: 0.75rem 0.75rem;
		border-radius: 2.5rem;
		background-color: var(--grey-two);
		backdrop-filter: blur(15px);
		-webkit-backdrop-filter: blur(15px);
		box-shadow:0 50px 100px -20px rgba(16, 22, 31, 0.25), 0 30px 60px -30px rgba(18, 19, 22, 0.767), inset 0 -2px 20px 0 rgba(20, 21, 23, 0.598);
		user-select: none;
		
	}
	@media (max-width: 1700px) {
		.hero-img {
			position: fixed;
			height: 100vh;
			top: 115px;
			right: 6rem;
		}
	}
</style>
