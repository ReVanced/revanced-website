<script>
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import Meta from '$lib/components/Meta.svelte';
	import Footer from '$layout/Footer/FooterHost.svelte';
	import AnimatedImage from '$lib/components/AnimatedImage.svelte';
</script>

<Meta title="Donate" />

<div class="wrapper center" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	<div id="horizontal">
		<AnimatedImage
			backgroundImageUrl="/revanced-logo-background.svg"
			foregroundImageUrl="/icons/heart.svg"
			alt="ReVanced Logo"
		/>
		<div>
			<h2>ReVanced <span>Donation</span></h2>
			<p>You can support the ReVanced team using the following options:</p>
			<h3>GitHub Sponsors</h3>
			<p>https://github.com/sponsors/ReVanced</p>
			<h3>Liberapay</h3>
			<p>https://liberapay.com/ReVanced/donate</p>
			<h3>Crypto</h3>
			<p>
				BTC: bc1q4x8j6mt27y5gv0q625t8wkr87ruy8fprpy4v3f
				<br />
				DOGE: D8GH73rNjudgi6bS2krrXWEsU9KShedLXp
				<br />
				ETH: 0x7ab4091e00363654bf84B34151225742cd92FCE5
				<br />
				LTC: LbJi8EuoDcwaZvykcKmcrM74jpjde23qJ2
				<br />
				XMR: 46YwWDbZD6jVptuk5mLHsuAmh1BnUMSjSNYacozQQEraWSQ93nb2yYVRHoMR6PmFYWEHsLHg9tr1cH5M8Rtn7YaaGQPCjSh
			</p>
		</div>
	</div>
</div>

<Footer />

<style>
	#horizontal {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}
	.center {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	h2,
	h3 {
		text-align: center;
		color: var(--white);
	}

	p {
		text-align: center;
		margin-bottom: 1.5rem;
	}

	span {
		color: var(--accent-color);
	}
</style>
