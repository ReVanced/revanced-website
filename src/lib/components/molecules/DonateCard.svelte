<script lang="ts">
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type Props = {
		name: string;
		image: string;
		href?: string;
		onclick?: () => void;
	} & Partial<HTMLAnchorAttributes> &
		Partial<HTMLButtonAttributes>;

	let { name, image, href, onclick, ...rest }: Props = $props();
</script>

{#if href}
	<a class="donate-card" {href} target="_blank" rel="noreferrer" {...rest}>
		<img class="card-image" src={image} alt={name} />
		<span class="card-label">{name}</span>
	</a>
{:else}
	<button type="button" class="donate-card" {onclick} {...rest}>
		<img class="card-image" src={image} alt={name} />
		<span class="card-label">{name}</span>
	</button>
{/if}

<style>
	.donate-card {
		text-decoration: none;
		background-color: var(--surface-nine);
		border-radius: 1.5rem;
		width: 100%;
		cursor: pointer;
		text-align: left;
		border: none;
		overflow: hidden;
		transition:
			border-radius 0.3s var(--bezier-one),
			background-color 0.3s var(--bezier-one);
		display: block;
		font-family: inherit;
		padding: 0;
	}

	.donate-card:hover {
		background-color: var(--tertiary);
	}

	.donate-card:active {
		border-radius: 2.75rem;
	}

	.card-image {
		height: 200px;
		width: 100%;
		object-fit: cover;
		object-position: center;
		display: block;
	}

	.card-label {
		display: block;
		color: var(--text-four);
		font-size: 1.05rem;
		font-weight: 500;
		padding: 1.5rem;
	}
</style>
