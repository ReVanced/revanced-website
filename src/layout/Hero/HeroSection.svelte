<script>
	import { queries } from '$data/api';
	import { createQuery } from '@tanstack/svelte-query';
	import Query from '$lib/components/Query.svelte';
	import TrayArrowDown from 'svelte-material-icons/TrayArrowDown.svelte';
	import FileDocumentOutline from 'svelte-material-icons/FileDocumentOutline.svelte';
	import Button from '$lib/components/Button.svelte';
	import SocialButton from './SocialButton.svelte';

	const aboutQuery = createQuery(queries.about());

	export let socialsVisibility = true;
</script>

<section class="hero">
	<h1>Continuing the <br />legacy of <span>Vanced.</span></h1>
	<p>
		Customize your mobile experience through ReVanced <br /> by applying patches to your applications.
	</p>
	<div class="hero-buttons-container">
		<div class="hero-buttons internal-buttons">
			<Button type="filled" icon={TrayArrowDown} href="download">Download</Button>
			<Button type="tonal" icon={FileDocumentOutline} href="patches">View patches</Button>
		</div>
		<div class="hero-buttons social-buttons" style:opacity={socialsVisibility ? '100%' : '0'}>
			<Query query={aboutQuery} let:data>
				{#if data}
					{#each data.about.socials.filter((s) => s.name != 'Website') as social}
						<SocialButton {social} />
					{/each}
				{/if}
			</Query>
		</div>
	</div>
</section>

<style>
	h1 {
		color: var(--text-one);
	}

	.hero-buttons-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.social-buttons {
		max-width: 30rem;
		position: absolute;
		bottom: 1rem;
		transition: opacity 0.1s var(--bezier-one);
	}

	.hero-buttons {
		flex-wrap: wrap;
		display: flex;
		user-select: none;
		gap: 1rem;
	}

	.hero {
		padding-top: 10vh;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	span {
		color: var(--primary);
	}

	@media screen and (max-width: 1100px) {
		.hero {
			padding-top: initial;
		}
	}

	@media screen and (max-width: 450px) {
		.internal-buttons {
			flex-direction: column;
			gap: 1rem;
		}

		.social-buttons {
			left: 50%;
			transform: translateX(-50%);
			justify-content: center;
			width: 100%;
		}

		.hero {
			height: initial;
		}
	}

	@media screen and (max-width: 1100px) or (min-height: 780px) {
		.social-buttons {
			transform: translateX(-50%);
			width: 90%;
			position: absolute;
			left: initial;
			transform: initial;
		}
	}

	@media screen and (max-height: 780px) {
		.social-buttons {
			transform: initial;
			left: initial;
			position: initial;
			width: initial;
			opacity: 100% !important;
		}
	}
</style>
