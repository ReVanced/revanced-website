<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import { queries } from '$data/api';
	import { createQuery } from '@tanstack/svelte-query';

	import Query from '$lib/components/Query.svelte';
	import FooterSection from './FooterSection.svelte';
	import { onMount } from 'svelte';
	import Divider from '$lib/components/Divider.svelte';
	import Button from '$lib/components/Button.svelte';
	import EmailDialog from '$layout/Dialogs/EmailDialog.svelte';
	import { RV_DMCA_GUID } from '../../env/static/public';

	const aboutQuery = createQuery(queries.about());

	let location: string;

	let showEmailDialog = false;

	onMount(() => {
		// DMCA Protection Badge
		location = document.location.href;
	});
</script>

<EmailDialog bind:showEmailDialog />

<Divider horizontalPadding={'15px'} />
<footer in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	<div class="top">
		<section class="main-content">
			<img src="/logo.svg" class="logo-image" alt="ReVanced Logo" />
			<div>
				<p>
					ReVanced was born out of Vanced's discontinuation and it is our goal to continue the
					legacy of what Vanced left behind. Thanks to ReVanced Patcher, it's possible to create
					long-lasting patches for nearly any Android app. ReVanced's patching system is designed to
					allow patches to work on new versions of the apps automatically with bare minimum
					maintenance.
				</p>
			</div>
		</section>

		<section class="links-container">
			<FooterSection title="Pages">
				<li><a href="/">Home</a></li>
				<li><a href="/download">Download</a></li>
				<li><a href="/patches">Patches</a></li>
				<li><a href="/contributors">Contributors</a></li>
				<li><a href="/donate">Donate</a></li>
			</FooterSection>
			<Query query={aboutQuery} let:data>
				{#if data}
					<FooterSection title="Socials">
						{#each data.about.socials as { name, url }}
							<li>
								<a href={url} target="_blank" rel="noreferrer">{name}</a>
							</li>
						{/each}
					</FooterSection>
				{/if}
			</Query>
		</section>
	</div>

	<div class="bottom">
		<div id="logo-name"><span>Re</span>Vanced</div>
		<Button type="text" style="color: var(--text-four); font-weight: 600;">
			<a href="/donate">Donate</a>
		</Button>
		<Button
			type="text"
			style="color: var(--text-four); font-weight: 600;"
			on:click={() => (showEmailDialog = true)}
		>
			E-Mail
		</Button>
		<!-- DMCA Protection Badge -->
		<a
			href="//www.dmca.com/Protection/Status.aspx?ID={RV_DMCA_GUID}&refurl={location}"
			title="DMCA.com Protection Status"
			class="dmca-badge"
		>
			<img
				src="https://images.dmca.com/Badges/dmca-badge-w150-5x1-08.png?ID={RV_DMCA_GUID}"
				alt="DMCA.com Protection Status"
			/>
		</a>
	</div>
</footer>

<style>
	footer {
		max-width: min(87%, 100rem);
		padding: 5rem 0rem;
		margin: 0 auto;
	}

	footer .top {
		display: flex;
		gap: 8rem;
		justify-content: space-between;
		margin-bottom: 4rem;
	}

	@media (max-width: 1050px) {
		footer .top {
			flex-direction: column;
			gap: 2rem;
		}
	}

	footer .bottom {
		display: flex;
		gap: 2rem;
		align-items: center;
	}

	footer .bottom a {
		text-decoration: none;
		color: var(--text-four);
		font-weight: 600;
	}

	@media (max-width: 768px) {
		footer .bottom {
			flex-wrap: wrap;
			gap: 1rem;
		}
	}

	.dmca-badge {
		display: flex;
		align-items: center;
	}

	#logo-name {
		font-size: 1.4rem;
		color: var(--text-one);
		font-weight: 600;
	}

	#logo-name span {
		color: var(--primary);
	}

	li {
		list-style: none;
		color: var(--text-four);
		font-size: 0.9rem;
		font-weight: 500;
	}

	li a {
		color: var(--primary);
		font-weight: 600;
		font-size: 0.95rem;
		transition: all var(--transition-base) var(--bezier-one);
	}

	.main-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: flex-start;
	}

	.logo-image {
		height: 2.5rem;
		transition: transform var(--transition-base) var(--bezier-one);
	}

	.logo-image:hover {
		transform: scale(1.05);
	}

	a {
		text-decoration: none;
		transition: all var(--transition-base) var(--bezier-one);
	}

	a:hover {
		text-decoration: none;
		color: var(--primary-hover);
		transform: translateX(2px);
	}

	.links-container {
		display: flex;
		gap: 10rem;
		margin-top: 1rem;
	}

	@media (max-width: 1050px) {
		.links-container {
			display: grid;
			gap: 2rem;
			grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
		}
	}

	@media (max-width: 768px) {
		.links-container {
			display: flex;
			flex-direction: column;
			gap: initial;
		}
	}
</style>
