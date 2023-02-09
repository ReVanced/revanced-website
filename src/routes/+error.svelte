<script lang="ts">
	import Meta from '$lib/components/Meta.svelte';
	import Navigation from '$layout/Navbar/NavButton.svelte';
	import { page } from '$app/stores';

	$: status = $page.status;
</script>

<Meta title="404" />

<section class="error">
	<h1>{status}</h1>
	{#if status == 404}
		<p>This page received a cease and desist letter from a multi-billion dollar tech company.</p>
		<br />
		<Navigation href="/" is_selected={() => true}>Home</Navigation>
	{:else}
		<p>
			{$page.error.message}
		</p>
	{/if}
</section>

<style>
	.error {
		padding-top: 5rem;
		text-align: center;
		height: 100vh;
		display: flex;
		gap: 12px;
		flex-direction: column;
		justify-content: center;
	}

	h1 {
		font-size: 10rem;
		color: var(--accent-color);
		margin-bottom: 24px;
	}

	p {
		font-size: 5ch;
		color: var(--white);
		line-height: 3rem;
	}
</style>
