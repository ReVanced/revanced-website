<script lang="ts">
	import PageShell from '$components/templates/PageShell.svelte';
	import { Api, type Announcement } from '$lib/data/api';

	let announcements = $state<Announcement[] | null>(null);
	let error = $state<string | null>(null);
	let loading = $state(true);

	$effect(() => {
		(async () => {
			loading = true; error = null;
			try { announcements = await Api.listAnnouncements(); }
			catch (e) { error = e instanceof Error ? e.message : 'Failed to load announcements'; }
			finally { loading = false; }
		})();
	});
</script>

<PageShell description="Latest updates from ReVanced">
	<h1 id="page-heading">Announcements</h1>

	{#if loading}
		<p>Loading…</p>
	{:else if error}
		<p role="alert">{error}</p>
	{:else if announcements && announcements.length}
		<ul class="list">
			{#each announcements as a}
				<li>
					<h3>{a.title}</h3>
					<p>{a.body}</p>
					<small>{new Date(a.createdAt).toLocaleString()}</small>
				</li>
			{/each}
		</ul>
	{:else}
		<p>No announcements yet.</p>
	{/if}
  
</PageShell>

<style>
	.list { display: grid; gap: var(--space-4); margin-top: var(--space-4); }
	h3 { color: var(--color-text); }
	small { color: var(--color-text-muted); }
	p { color: var(--color-text); }
	li { padding: var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-2); }
  
</style>

 
