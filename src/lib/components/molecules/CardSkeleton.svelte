<script lang="ts">
	import Skeleton from '$components/atoms/Skeleton.svelte';

	interface Props {
		count?: number;
		class?: string;
	}

	let { count = 3, class: className = '' }: Props = $props();
</script>

<div class="card-skeleton-grid {className}">
	{#each Array(count) as _}
		<div class="card-skeleton">
			<Skeleton variant="image" height="8rem" />
			<div class="card-skeleton__content">
				<Skeleton variant="title" width="70%" />
				<Skeleton variant="text" />
				<Skeleton variant="text" width="85%" />
			</div>
		</div>
	{/each}
</div>

<style>
	.card-skeleton-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.card-skeleton {
		background: var(--color-surface-50);
		border-radius: 0.75rem;
		overflow: hidden;
		border: 1px solid var(--color-surface-100);
	}

	.card-skeleton__content {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
