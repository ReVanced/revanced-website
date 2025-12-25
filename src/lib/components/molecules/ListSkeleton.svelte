<script lang="ts">
	import Skeleton from '$components/atoms/Skeleton.svelte';

	interface Props {
		count?: number;
		class?: string;
	}

	let { count = 5, class: className = '' }: Props = $props();
</script>

<div class="list-skeleton {className}">
	{#each Array(count) as _}
		<div class="list-skeleton__item">
			<Skeleton variant="avatar" />
			<div class="list-skeleton__content">
				<Skeleton variant="text" width="40%" />
				<Skeleton variant="text" width="70%" height="0.875rem" />
			</div>
		</div>
	{/each}
</div>

<style>
	.list-skeleton {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.list-skeleton__item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 0;
	}

	.list-skeleton__content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}
</style>
