<script lang="ts">
	import Skeleton from '$components/atoms/Skeleton.svelte';
</script>

<div class="loading-wrapper">
	<div class="loading-card">
		<div class="loading-header">
			<div class="loading-header-content">
				<Skeleton variant="title" width="70%" height="2.5rem" />
				<div class="loading-meta">
					<Skeleton variant="text" width="120px" height="1rem" />
					<Skeleton variant="text" width="80px" height="1rem" />
				</div>
				<div class="loading-tags">
					<Skeleton variant="button" width="60px" height="1.5rem" radius="full" />
					<Skeleton variant="button" width="80px" height="1.5rem" radius="full" />
					<Skeleton variant="button" width="70px" height="1.5rem" radius="full" />
				</div>
			</div>
		</div>
		
		<hr class="loading-divider" />
		
		<div class="loading-content">
			<Skeleton variant="text" width="100%" />
			<Skeleton variant="text" width="95%" />
			<Skeleton variant="text" width="100%" />
			<Skeleton variant="text" width="88%" />
			<Skeleton variant="text" width="100%" />
			<Skeleton variant="text" width="70%" />
		</div>
		
		<hr class="loading-divider" />
		
		<div class="loading-attachments">
			<Skeleton variant="image" width="200px" height="150px" radius="md" />
			<Skeleton variant="image" width="200px" height="150px" radius="md" />
		</div>
	</div>
</div>

<style>
	.loading-wrapper {
		width: min(90%, 80rem);
		margin-inline: auto;
		padding-block: 2rem;
	}

	.loading-card {
		background-color: var(--surface-eight);
		padding: 2rem;
		border-radius: 1rem;
	}

	.loading-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 2rem;
	}

	.loading-header-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		flex: 1;
	}

	.loading-meta {
		display: flex;
		gap: 1rem;
	}

	.loading-tags {
		display: flex;
		gap: 0.5rem;
	}

	.loading-divider {
		border: none;
		height: 2px;
		background: var(--surface-four);
		margin: 1.5rem 0;
	}

	.loading-content {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.loading-attachments {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	@media (max-width: 768px) {
		.loading-wrapper {
			padding-block: 1rem;
		}

		.loading-card {
			background-color: transparent;
			padding: 0;
		}
	}
</style>
