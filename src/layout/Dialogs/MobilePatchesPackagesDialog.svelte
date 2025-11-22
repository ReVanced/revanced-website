<script lang="ts">
	import Package from '../../routes/patches/Package.svelte';
	import Dialog from '$layout/dialogs/Dialog.svelte';

	let {
		dialogOpen = $bindable(false),
		searchTerm = $bindable(''),
		data,
		selectedPkg
	}: {
		dialogOpen?: boolean;
		searchTerm?: string;
		data: any;
		selectedPkg: any;
	} = $props();
</script>

<Dialog bind:dialogOpen fullscreen>
	{#snippet title()}Packages{/snippet}
	<div class="mobile-packages">
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<span
			onclick={() => (dialogOpen = !dialogOpen)}
			onkeypress={() => (dialogOpen = !dialogOpen)}
		>
			<Package {selectedPkg} name="All packages" {searchTerm} />
		</span>
		{#each data.packages as pkg}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<span
				onclick={() => (dialogOpen = !dialogOpen)}
				onkeypress={() => (dialogOpen = !dialogOpen)}
			>
				<Package {selectedPkg} name={pkg} {searchTerm} />
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
