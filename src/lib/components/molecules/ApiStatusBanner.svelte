<script lang="ts">
	import { apiStatus } from '$stores';
	import { getStatusUrl, getContactEmail } from '$api';
	import Button from '$components/atoms/Button.svelte';
	import ArrowRight from 'virtual:icons/material-symbols/arrow-right-alt';

	const statusUrl = getStatusUrl();
	const email = getContactEmail();
	let visible = $derived(apiStatus.isOffline);
</script>

{#if visible}
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
				<span class="arrow-icon"><ArrowRight /></span>
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
		position: sticky;
		top: 0;
		left: 0;
		z-index: 10000;

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
