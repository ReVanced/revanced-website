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
	<h3>{name}</h3>
</div>

<style>
	.package {
		padding: 0.6rem;
		border-radius: 8px;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.6rem;
		width: 100%;
		user-select: none;
		transition: all 0.4s var(--bezier-one);
	}

	.package::before {
		content: '';
		height: 5px;
		inline-size: 4px;
		border-radius: 200px;
		background-color: var(--accent-color);
		transition: all 0.2s var(--bezier-one);
		opacity: 0;
	}

	.selected::before {
		height: 20px;
		transition: all 0.3s var(--bezier-one);
		opacity: 1;
	}

	h3 {
		font-size: 0.9rem;
	}

	.package > h3 {
		color: var(--grey-five);
		transition: all 0.3s var(--bezier-one);
	}

	.selected > h3 {
		color: var(--accent-color);
		transition: all 0.3s var(--bezier-one);
	}

	.package:hover,
	.selected {
		background-color: var(--grey-six);
	}

	.package:not(.selected):hover > h3 {
		color: var(--white);
	}
</style>
