<script lang="ts">
	import Package from '../../routes/patches/Package.svelte';
	import Dialog from '$layout/Dialogs/Dialog.svelte';

	export let dialogOpen: boolean;
	export let searchTerm: string;
	export let data;
	export let selectedPkg;
</script>

<Dialog bind:dialogOpen fullscreen>
	<svelte:fragment slot="title">Packages</svelte:fragment>
	<div class="mobile-packages">
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<span
			on:click={() => (dialogOpen = !dialogOpen)}
			on:keypress={() => (dialogOpen = !dialogOpen)}
		>
			<Package {selectedPkg} name="All packages" bind:searchTerm />
		</span>
		{#each data.packages as pkg}
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<span
				on:click={() => (dialogOpen = !dialogOpen)}
				on:keypress={() => (dialogOpen = !dialogOpen)}
			>
				<Package {selectedPkg} name={pkg} bind:searchTerm />
			</span>
		{/each}
	</div>
</Dialog>

<style lang="scss">
	.mobile-packages {
		margin-bottom: -1px;
		overflow: hidden;
		border-radius: 12px;
		border: 1px solid var(--border);
	}
</style>
