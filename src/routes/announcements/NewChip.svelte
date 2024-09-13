<script lang="ts">
	export let shiny: boolean = false; // TODO: implement effects later
</script>

<span class="new-chip" class:shiny>NEW</span>

<style>
	/* TODO: implement effects later */
	.new-chip {
		background-color: var(--primary);
		border: none;
		border-radius: 0.6rem;
		color: #000;
		padding: 0.2rem 0.5rem;
	}
</style>
