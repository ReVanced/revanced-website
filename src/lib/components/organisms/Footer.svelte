<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	import logo from '$assets/icons/logo.svg';
	import Divider from '$components/atoms/Divider.svelte';
	import FooterSection from '$components/molecules/FooterSection.svelte';
	import { footerVisibility } from '$stores';
	import { PUBLIC_RV_DMCA_GUID as dmcaGuid } from '$env/static/public';
	import type { Social } from '$api';

	type FooterLink = {
		label: string;
		href: string;
	};

	type Props = {
		about: string;
		pageLinks: FooterLink[];
		socials: Social[];
		contactEmail?: string;
		onEmailClick?: () => void;
	};

	let {
		about,
		pageLinks,
		socials,
		contactEmail,
		onEmailClick
	}: Props = $props();

	let currentUrl = $state('');
	let socialsSection: HTMLElement | null = $state(null);

	$effect(() => {
		if (typeof window !== 'undefined') {
			currentUrl = window.location.href;
		}
	});

	onMount(() => {
		if (!socialsSection) return;

		const observer = new IntersectionObserver(
			(entries) => entries.forEach((e) => footerVisibility.set(e.isIntersecting)),
			{ threshold: 0 }
		);
		observer.observe(socialsSection);

		return () => {
			observer.disconnect();
			footerVisibility.set(false);
		};
	});

	function buildDmcaStatusUrl(guid: string): string {
		return `//www.dmca.com/Protection/Status.aspx?ID=${guid}&refurl=${currentUrl}`;
	}

	function buildDmcaBadgeUrl(guid: string): string {
		return `https://images.dmca.com/Badges/dmca-badge-w150-5x1-08.png?ID=${guid}`;
	}
</script>

<Divider padding="15px" />

<footer transition:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	<div class="top">
		<section class="main-content">
			<img src={logo} class="logo-image" alt="ReVanced Logo" />
			<div>
				<p>{about}</p>
			</div>
		</section>

		<section class="links-container">
			{#if socials.length > 0}
				<FooterSection title="Pages">
					{#each pageLinks as { label, href }}
						<li><a {href}>{label}</a></li>
					{/each}
				</FooterSection>

				<FooterSection title="Socials" bind:sectionRef={socialsSection}>
					{#each socials as { name, url }}
						<li>
							<a href={url} target="_blank" rel="noreferrer">{name}</a>
						</li>
					{/each}
				</FooterSection>
			{:else}
				<FooterSection title="Pages" bind:sectionRef={socialsSection}>
					{#each pageLinks as { label, href }}
						<li><a {href}>{label}</a></li>
					{/each}
				</FooterSection>
			{/if}
		</section>
	</div>

	<div class="bottom">
		<div class="logo-name"><span>Re</span>Vanced</div>

		<a href="/donate" class="bottom-link">Donate</a>

		{#if onEmailClick}
			<button type="button" class="bottom-link" onclick={onEmailClick}>
				E-Mail
			</button>
		{:else if contactEmail}
			<a href="mailto:{contactEmail}" class="bottom-link">E-Mail</a>
		{/if}

		{#if dmcaGuid}
			<a
				href={buildDmcaStatusUrl(dmcaGuid)}
				title="DMCA.com Protection Status"
				class="dmca-badge"
				target="_blank"
				rel="noreferrer"
			>
				<img
					src={buildDmcaBadgeUrl(dmcaGuid)}
					alt="DMCA.com Protection Status"
					loading="lazy"
				/>
			</a>
		{/if}
	</div>
</footer>

<style>
	footer {
		max-width: min(87%, 100rem);
		padding: 5rem 0;
		margin: 0 auto;
	}

	.top {
		display: flex;
		gap: 8rem;
		justify-content: space-between;
		margin-bottom: 4rem;
	}

	@media (max-width: 1050px) {
		.top {
			flex-direction: column;
			gap: 2rem;
		}
	}

	.bottom {
		display: flex;
		gap: 2rem;
		align-items: center;
	}

	@media (max-width: 768px) {
		.bottom {
			flex-wrap: wrap;
			gap: 1rem;
		}
	}

	.bottom-link {
		text-decoration: none;
		color: var(--text-four);
		font-weight: 600;
		font-size: 0.95rem;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		font-family: inherit;
		transition:
			transform 0.4s var(--bezier-one),
			filter 0.4s var(--bezier-one);
		user-select: none;
	}

	.bottom-link:hover {
		filter: brightness(85%);
	}

	.logo-name {
		font-size: 1.4rem;
		color: var(--text-one);
		font-weight: 600;
	}

	.logo-name span {
		color: var(--primary);
	}

	.main-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: flex-start;
	}

	.logo-image {
		height: 2.5rem;
	}

	.links-container {
		display: flex;
		gap: 10rem;
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
			gap: 0;
		}
	}

	footer :global(li) {
		list-style: none;
		color: var(--text-four);
		font-size: 0.9rem;
		font-weight: 500;
	}

	footer :global(li a) {
		color: var(--primary);
		font-weight: 600;
		font-size: 0.95rem;
		text-decoration: none;
	}

	footer :global(li a:hover) {
		text-decoration: underline var(--secondary);
		color: var(--text-one);
	}

	.dmca-badge {
		display: flex;
		align-items: center;
		transition:
			transform 0.4s var(--bezier-one),
			filter 0.4s var(--bezier-one);
		user-select: none;
	}

	.dmca-badge:hover {
		filter: brightness(85%);
	}
</style>
