<script lang="ts">
	import { queries } from '$data/api';
	import { createQuery } from '@tanstack/svelte-query';
	import Query from '$lib/components/Query.svelte';
	import TrayArrowDown from 'svelte-material-icons/TrayArrowDown.svelte';
	import FileDocumentOutline from 'svelte-material-icons/FileDocumentOutline.svelte';
	import Button from '$lib/components/Button.svelte';
	import SocialButton from './SocialButton.svelte';
	import type { Social } from '$lib/types';

	const aboutQuery = createQuery(() => queries.about());

	let {
		socialsVisibility = true
	}: {
		socialsVisibility?: boolean;
	} = $props();

	let filteredSocials = $derived.by(() => {
		if (aboutQuery.data && typeof aboutQuery.data === 'object' && 'about' in aboutQuery.data && aboutQuery.data.about && 'socials' in aboutQuery.data.about) {
			return aboutQuery.data.about.socials
				.filter((s: Social) => s.name !== 'Website')
				.map((s: Social) => ({ ...s, preferred: typeof s.preferred === 'boolean' ? s.preferred : false }));
		} else {
			return [];
		}
	});
</script>

<section class="hero">
	<h1>Continuing the <br />legacy of <span>Vanced.</span></h1>
	<p>
		Customize your mobile experience through ReVanced <br /> by applying patches to your applications.
	</p>
	<div class="buttons-container">
		<div class="hero-buttons internal-buttons">
			<Button type="filled" icon={TrayArrowDown} href="download">Download</Button>
			<Button type="tonal" icon={FileDocumentOutline} href="patches">View patches</Button>
		</div>
		<div class="hero-buttons social-buttons" style:opacity={socialsVisibility ? '100%' : '0'}>
			<Query query={aboutQuery}>
				{#snippet children(data)}
					{#if data}
						{#each filteredSocials as social}
							<SocialButton {social} />
						{/each}
					{/if}
				{/snippet}
			</Query>
		</div>
	</div>
</section>

<style lang="scss">
	.hero {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		@media (min-width: 1100px) {
			padding-top: 10vh;
		}

		h1 {
			color: var(--text-one);
		}

		span {
			color: var(--primary);
		}

		.buttons-container {
			display: flex;
			flex-direction: column;
			gap: 2.5rem;

			.social-buttons {
				max-width: 30rem;
				position: absolute;
				bottom: 1rem;
				transition: opacity 0.1s var(--bezier-one);

				@media (max-width: 450px) {
					justify-content: center;
					left: 0;
				}

				@media (max-height: 600px), (max-width: 450px) and (max-height: 780px) {
					position: static;
					opacity: 100% !important;
				}
			}

			.hero-buttons {
				flex-wrap: wrap;
				display: flex;
				user-select: none;
				gap: 1rem;

				@media (max-width: 450px) {
					&.internal-buttons {
						flex-direction: column;
						gap: 1rem;
					}
				}
			}
		}
	}
</style>
