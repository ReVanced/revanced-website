<script lang="ts">
	import type { Social } from '$api';

	type Props = {
		social: Social;
	};

	let { social }: Props = $props();

	const icons = import.meta.glob('$assets/socials/*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
	function getIconUrl(name: string): string {
		const key = Object.keys(icons).find(k => k.toLowerCase().includes(name.toLowerCase()));
		return key ? icons[key] : '';
	}

	let iconSrc = $derived(getIconUrl(social.name));
</script>

<a
	href={social.url}
	rel="noreferrer"
	target="_blank"
	class="social-button"
	aria-label={social.name}
>
	<img src={iconSrc} alt={social.name} />
</a>

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
</style>
