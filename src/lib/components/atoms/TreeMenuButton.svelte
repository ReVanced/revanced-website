<script lang="ts">
	export let current: string | boolean;
	export let name: string;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="package"
	class:selected={current === name}
	on:click={() =>
		(current = current === name ? false : name) && window.scrollTo({ top: 0, behavior: 'smooth' })}
>
	<h5>{name}</h5>
</div>

<style>
	.package {
		padding: 0.6rem 1rem;
		border-radius: 8px;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.6rem;
		width: 100%;
		user-select: none;
		transition: background-color 0.4s var(--bezier-one);
	}

	.package > h5 {
		color: var(--grey-five);
		transition: color 0.3s var(--bezier-one);
	}

	.selected > h5 {
		color: var(--grey-four);
		transition: color 0.3s var(--bezier-one);
	}

	.selected {
		background-color: var(--accent-color);
	}
	.package:hover:not(.selected) {
		background-color: var(--grey-six);
	}

	.package:not(.selected):hover > h5 {
		color: var(--white);
	}
</style>
