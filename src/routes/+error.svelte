<script lang="ts">
	import Meta from '$lib/components/Meta.svelte';
	import Navigation from '$layout/Navbar/NavButton.svelte';
	import { page } from '$app/stores';

	$: status = $page.status;
</script>

<Meta title="404" />

<section class="error wrapper">
	<h1>{status}</h1>
	{#if status == 404}
		<p>That page received a cease and desist letter from a multi-billion dollar tech company.</p>
		<br />
		<Navigation href="/">Home</Navigation>
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
	}

	h1 {
		color: var(--accent-color);
	}
	p {
		color: var(--white);
	}
</style>
