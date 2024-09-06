<script lang="ts">
	import moment from 'moment';

	import Dialogue from '$lib/components/Dialogue.svelte';

	export let title: string;
	export let author: string;
	export let created_at: string | Date;

	let showContent = false;
</script>

<div class="announcement-card">
	<h2>{title}</h2>
	<h3>
		by
		<a class="author" href="http://github.com/{author}" target="_blank" rel="noopener noreferrer">
			{author}
		</a>,
		<span class="date">{moment(created_at).fromNow()}</span>
	</h3>
	{#if $$slots.channel}
		<div class="channel"><slot name="channel" /></div>
	{/if}
	<button class="read-more" on:click={() => (showContent = true)}>Read more</button>
</div>

<Dialogue bind:modalOpen={showContent} fullscreen>
	<svelte:fragment slot="icon">
		<img src="https://github.com/{author}.png" alt="Author avatar" class="author-avatar" />
	</svelte:fragment>
	<svelte:fragment slot="title">{title}</svelte:fragment>
	<svelte:fragment slot="description">
		<slot name="content" />
	</svelte:fragment>
</Dialogue>

<style>
</style>
