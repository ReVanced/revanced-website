<script lang="ts">

	type Props = {
		name: string;
		avatarUrl: string;
		url: string;
	};

	let { name, avatarUrl, url }: Props = $props();

	let alt = $derived(`${name}'s profile picture`);
</script>

<a href={url} rel="noreferrer" target="_blank" class="contributor">
	<img src={avatarUrl} {alt} loading="lazy" />
	<h5 class="name">{name}</h5>
</a>

<style>
	.contributor {
		color: var(--text-one);
		text-decoration: none;
		cursor: pointer;
		padding: 0.9rem 1rem;
		width: 100%;
		transition: background-color 0.3s var(--bezier-one);
		display: flex;
		gap: 1rem;
		align-items: center;
		border-right: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
	}

	.contributor:hover {
		background: var(--surface-three);
	}

	.contributor:hover .name {
		text-decoration: underline var(--primary);
		color: var(--text-one);
	}

	.name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		padding: 0.25rem 0;
	}

	img {
		border-radius: 50%;
		height: 32px;
		width: 32px;
		background-color: var(--surface-four);
		transition: transform 0.4s var(--bezier-one);
		user-select: none;
		object-fit: cover;
	}

	@media (max-width: 768px) {
		.name {
			display: none;
		}

		img {
			height: 42px;
			width: 42px;
		}

		.contributor {
			width: max-content;
			background-color: transparent;
			border: none;
			padding: 0.5rem;
		}
	}
</style>
