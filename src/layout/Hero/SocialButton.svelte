<script lang="ts">
	import type { Social } from '$lib/types';
	export let social: Social;
</script>

<a href={social.url} rel="noreferrer" target="_blank">
	<img src="socials/{social.name.toLowerCase()}.svg" alt={social.name} />
</a>

<style>
	a {
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

	a {
		display: flex;
		justify-content: center;
	}

	img {
		transition: filter 0.4s var(--bezier-one);
		width: 30px;
	}

	a:hover {
		transform: translateY(-5%);
	}

	a:hover img {
		filter: brightness(1.2);
	}
</style>
