<script>
    import SocialButton from "../atoms/SocialButton.svelte";
</script>

<div class="social-host">
    <SocialButton></SocialButton>
    <SocialButton></SocialButton>
    <SocialButton></SocialButton>
    <SocialButton></SocialButton>
</div>

<style>
    .social-host {
        width: 100;
        justify-content: space-between;
		align-items: center;
        display: flex;
        margin-left: 5rem;
        margin-right: 5rem;
    }
</style>