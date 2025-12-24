<script lang="ts">
	import type { Social } from '$api';

	type Props = {
		social: Social;
	};

	let { social }: Props = $props();

	const icons = import.meta.glob('$assets/socials/*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

	function normalizeName(name: string): string {
		return name.toLowerCase().replace(/[^a-z0-9]/g, '');
	}

	function getIconUrl(name: string): string {
		const normalizedName = normalizeName(name);
		
		for (const [path, url] of Object.entries(icons)) {
			const filename = path.split('/').pop()?.replace('.svg', '') ?? '';
			if (normalizeName(filename) === normalizedName) {
				return url;
			}
		}
		
		for (const [path, url] of Object.entries(icons)) {
			const filename = path.split('/').pop()?.replace('.svg', '') ?? '';
			if (normalizeName(filename).includes(normalizedName) || normalizedName.includes(normalizeName(filename))) {
				return url;
			}
		}
		
		if (import.meta.env.DEV) {
			console.warn(`[SocialButton] No icon found for social: "${name}". Available icons:`, Object.keys(icons).map(k => k.split('/').pop()));
		}
		return '';
	}

	let iconSrc = $derived(getIconUrl(social.name));
	let hasIcon = $derived(iconSrc !== '');
</script>

{#if hasIcon}
<a
	href={social.url}
	rel="noreferrer"
	target="_blank"
	class="social-button"
	aria-label={social.name}
>
	<img src={iconSrc} alt={social.name} />
</a>
{:else}
<a
	href={social.url}
	rel="noreferrer"
	target="_blank"
	class="social-button text-fallback"
	aria-label={social.name}
>
	<span class="fallback-text">{social.name.charAt(0).toUpperCase()}</span>
</a>
{/if}

<style>
	.social-button {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 0;
		width: 60px;
		height: 60px;
		padding: 14px;
		cursor: pointer;
		border-radius: 200px;
		transition: transform 0.4s var(--bezier-one);
		background-color: var(--surface-four);
		color: var(--text-one);
		user-select: none;
	}

	.social-button:hover {
		transform: translateY(-5%);
	}

	.social-button img {
		transition: filter 0.4s var(--bezier-one);
		width: 30px;
		height: 30px;
	}

	.social-button:hover img {
		filter: brightness(1.2);
	}

	.text-fallback {
		background-color: var(--primary);
	}

	.fallback-text {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--text-three);
	}
</style>
