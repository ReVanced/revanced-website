<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$components/atoms/Button.svelte';
	import IconHome from 'virtual:icons/material-symbols/home';

	let status = $derived($page.status);
	let errorMessage = $derived($page.error?.message ?? 'An unexpected error occurred');
</script>

<svelte:head>
	<title>{status} | ReVanced</title>
</svelte:head>

<section class="wrapper">
	<div class="error-content">
		<h1 class="status-code">{status}</h1>

		{#if status === 404}
			<p class="message">
				This page received a cease and desist letter from a multi-billion dollar tech company.
			</p>
			<p class="subtext">Just kidding. The page you're looking for doesn't exist.</p>
		{:else if status === 500}
			<p class="message">Something went wrong on our end.</p>
			<p class="subtext">Please try again later.</p>
		{:else}
			<p class="message">{errorMessage}</p>
		{/if}

		<div class="actions">
			<Button buttonStyle="filled" href="/" icon={IconHome}>
				Return home
			</Button>
		</div>
	</div>
</section>

<style>
	.wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: calc(100vh - 200px);
		padding: 2rem;
	}

	.error-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		max-width: 500px;
	}

	.status-code {
		font-size: clamp(6rem, 15vw, 12rem);
		font-weight: 700;
		color: var(--primary);
		line-height: 1;
		margin: 0;
		margin-bottom: 1rem;
	}

	.message {
		font-size: 1.25rem;
		color: var(--text-one);
		margin: 0;
		margin-bottom: 0.5rem;
	}

	.subtext {
		font-size: 1rem;
		color: var(--text-four);
		margin: 0;
		margin-bottom: 2rem;
	}

	.actions {
		display: flex;
		gap: 1rem;
	}
</style>
