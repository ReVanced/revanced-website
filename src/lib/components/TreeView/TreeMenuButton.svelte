<script lang="ts">
	export let selectedPkg: string | boolean;
	export let name: string;

	function handleClick() {
		selectedPkg = selectedPkg === name ? false : name
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="package"
	class:selected={selectedPkg === name}
	on:click={handleClick}
>
	{name}
</div>

<style>
	.package {
		padding: 0.6rem 1rem;
		font-size: 0.9rem;
		border-radius: 8px;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.6rem;
		width: 100%;
		user-select: none;
		transition: background-color 0.4s var(--bezier-one);
	}

	.package{
		color: var(--grey-five);
		transition: color 0.3s var(--bezier-one);
	}

	.selected {
		color: var(--grey-four);
		transition: color 0.3s var(--bezier-one);
	}

	.selected {
		background-color: var(--accent-color);
	}
	.package:hover:not(.selected) {
		background-color: var(--grey-six);
	}

	.package:not(.selected):hover {
		color: var(--white);
	}

	@media (max-width: 768px) {
		.package {
			border-radius: 12px;
			padding: 0.5rem 1rem;
			width: max-content;
			background-color: transparent;
			border: 1px solid var(--grey-three);
		}

		.package{
			overflow: hidden;
			text-overflow: ellipsis;
			color: var(--accent-color);
		}

		.selected {
			background-color: var(--accent-low-opacity);
		}
		.package:not(.selected):hover {
			color: var(--grey-five);
		}
	}
</style>
