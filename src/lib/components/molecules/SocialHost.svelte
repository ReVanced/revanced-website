<script>
	import SocialButton from '../atoms/SocialButton.svelte';
</script>

<div class="social-host">
	<SocialButton src="socials/github.svg" alt="GitHub" href="https://revanced.app/github" />
	<SocialButton src="socials/discord.svg" alt="Discord" href="http://revanced.app/discord" />
	<SocialButton src="socials/reddit.svg" alt="Reddit" href="https://revanced.app/reddit" />
	<SocialButton src="socials/telegram.svg" alt="Telegram" href="https://revanced.app/telegram" />
</div>

<style>
	.social-host {
		width: min(87%, 100rem);
        /* same as margin-inline: auto on .wrapper */
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
