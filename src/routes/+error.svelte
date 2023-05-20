<script lang="ts">
	import Meta from '$lib/components/Meta.svelte';
	import Navigation from '$layout/Navbar/NavButton.svelte';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';

	$: status = $page.status;
</script>

<Meta title="404" />

<section class="wrapper">
	<h1>{status}</h1>
	{#if status == 404}
		<p>This page received a cease and desist letter from a multi-billion dollar tech company.</p>
		<br />
		<Button kind="primary" href="/">Return Home</Button>	
	{:else}
		<p>
			{$page.error?.message}
		</p>
	{/if}
</section>

<style>
	section {
		text-align: center;
		margin-top: 10rem;
	}

	h1 {
		color: var(--accent-color);
	}

</style>
