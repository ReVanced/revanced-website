<script>
    import SocialButton from "../atoms/SocialButton.svelte";
</script>

<div class="social-host">
    <SocialButton src="socials/github.svg" alt="GitHub" href="https://revanced.app/github"></SocialButton>
    <SocialButton src="socials/discord.svg" alt="Discord" href="http://revanced.app/discord"></SocialButton>
    <SocialButton src="socials/reddit.svg" alt="Reddit" href="https://revanced.app/reddit"></SocialButton>
    <SocialButton src="socials/telegram.svg" alt="Telegram" href="https://revanced.app/telegram"></SocialButton>
</div>

<style>
    .social-host {
        justify-content: space-between;
        position: sticky;
		align-items: center;
        bottom:0;
        padding-left: 5rem;
        padding-bottom: 3rem;
    }
</style>