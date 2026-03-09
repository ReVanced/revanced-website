<script lang="ts">
	import { getStatusUrl, getContactEmail } from '$api';
	import Button from '$components/atoms/Button.svelte';
	import ArrowRight from 'svelte-material-icons/ArrowRight.svelte';

	let { apiIsDown = false }: { apiIsDown: boolean } = $props();

	const statusUrl = getStatusUrl();
	const email = getContactEmail();
</script>

{#if apiIsDown}
	<div class="banner caution">
		<div class="text">
			<h1 class="title">API service is currently down</h1>
			<h2 class="description">
				Some features of the site might be impacted. If this issue persists, reach out to {email}.
			</h2>
		</div>
		<div class="actions">
			<Button 
				variant="onDangerBackground" 
				href={statusUrl}
				target="_blank"
			>
				Check status
				<span class="arrow-icon"><ArrowRight size={20} /></span>
			</Button>
		</div>
	</div>
{/if}

<style>
	.title {
		line-height: 26px;
		color: currentColor;
		font-size: 20px;
		margin: 0;
		font-weight: 500;
	}

	.description {
		line-height: 24px;
		color: currentColor;
		font-size: 15px;
		margin: 0;
		font-weight: 400;
		letter-spacing: 0.01em;
	}

	.banner {
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		gap: 1.3rem;
		width: 100%;
		margin: 0;
		padding: 24px 40px;
		border-radius: 0;
		font-size: 0.87rem;
		position: relative;
		z-index: var(--z-toast);

		&.caution {
			background-color: var(--red-three);
			color: #601410;
		}

		@media (max-width: 768px) {
			flex-direction: column;
			align-items: stretch;
			padding: 1.1rem 1.3rem;
		}
	}

	.text {
		display: flex;
		flex-direction: column;
		flex: 1;
		gap: 0.55rem;
		word-wrap: break-word;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 1rem;
	}

	.arrow-icon {
		display: inline-flex;
		align-items: center;
		vertical-align: middle;
	}
</style>
