<script lang="ts">
	import Skeleton from '$components/atoms/Skeleton.svelte';

	interface Props {
		lines?: number;
		titleWidth?: string;
		class?: string;
	}

	let { lines = 3, titleWidth = '60%', class: className = '' }: Props = $props();
</script>

<div class="content-skeleton {className}">
	<Skeleton variant="title" width={titleWidth} />
	<div class="content-skeleton__body">
		{#each Array(lines) as _, i}
			<Skeleton variant="text" width={i === lines - 1 ? '80%' : '100%'} />
		{/each}
	</div>
</div>

<style>
	.content-skeleton {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.content-skeleton__body {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
