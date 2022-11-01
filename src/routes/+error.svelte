<script lang="ts">
	import Navigation from '$lib/components/atoms/NavButton.svelte';
	import { page } from '$app/stores';

	$: status = $page.status;
</script>

<section class="error">
	<h1>{status}</h1>
	{#if status == 500}
		<p>
			{$page.error.message}
		</p>
	{:else if status == 404}
		<p>That page received a cease and desist letter from a multi-billion dollar tech company.</p>
		<br />
		<Navigation href="/" is_selected={() => true}>Home</Navigation>
	{/if}
</section>

<style>
	.error {
		padding-top: 5rem;
		text-align: center;
	}

	h1 {
		font-size: 10rem;
		color: var(--accent-color);
	}
	p {
		font-size: 5ch;
		color: var(--white);
	}
</style>
