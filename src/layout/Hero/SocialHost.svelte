<script>
	import SocialButton from './SocialButton.svelte';
</script>

<!-- TODO: Use API social links -->
<div class="social-host">
	<SocialButton src="github" href="https://github.com/revanced" />
	<SocialButton src="discord" href="https://revanced.app/discord" />
	<SocialButton src="reddit" href="https://reddit.com/r/revancedapp" />
	<SocialButton src="telegram" href="https://t.me/app_revanced" />
</div>

<style>
	.social-host {
		width: min(87%, 100rem);
		padding: 0 max(6.5%, calc(50vw - 50rem));
		align-items: center;
		user-select: none;
		position: absolute;
		display: flex;
		bottom: 2rem;
		gap: 1rem;
		left: 0;
	}

	@media screen and (max-width: 768px) {
		.social-host {
			left: 0;
			width: 100%;
			display: flex;
			justify-content: center;
		}
	}
</style>
