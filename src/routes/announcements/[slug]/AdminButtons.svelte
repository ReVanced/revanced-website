<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	export let isEditing: boolean,
		isCreating,
		isPreviewing: boolean,
		showDeleteConfirm: boolean,
		createAnnouncement,
		save;
</script>

<div>
	{#if isEditing}
		<Button
			type="icon"
			icon={isPreviewing ? 'hide' : 'show'}
			on:click={() => (isPreviewing = !isPreviewing)}
		/>
		<Button type="icon" icon={'close'} on:click={() => (isEditing = false)} />
		<Button type="icon" icon={'check'} on:click={save} />
	{:else if isCreating}
		<Button
			type="icon"
			icon={isPreviewing ? 'hide' : 'show'}
			on:click={() => (isPreviewing = !isPreviewing)}
		/>
		<Button type="icon" icon={'check'} on:click={createAnnouncement} />
	{:else}
		<Button type="icon" icon={'delete'} on:click={() => (showDeleteConfirm = !showDeleteConfirm)} />
		<Button type="icon" icon={'edit'} on:click={() => (isEditing = !isEditing)} />
	{/if}
</div>

<style>
	div {
		display: flex;
		gap: 1rem;
	}
</style>
