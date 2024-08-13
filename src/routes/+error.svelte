<script lang="ts">
	import Meta from '$lib/components/Head.svelte';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';

	$: status = $page.status;
</script>

<Meta title={status.toString()} />

<section class="wrapper">
	<h1>{status}</h1>
	{#if status == 404}
		<p>This page received a cease and desist letter from a multi-billion dollar tech company.</p>
		<br />
		<Button type="filled" href="/">Return Home</Button>
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
		color: var(--primary);
	}
</style>
