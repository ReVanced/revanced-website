<script lang="ts">
	type Props = {
		name: string;
		selected?: boolean;
		onclick?: () => void;
	};

	let { name, selected = false, onclick }: Props = $props();
</script>

<button
	type="button"
	class="package"
	class:selected
	{onclick}
>
	{name}
</button>

<style>
	.package {
		display: block;
		width: 100%;
		text-align: left;
		padding: 0.75rem 1rem;
		border-radius: 100px;
		border: none;
		background: transparent;
		font-family: inherit;
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--text-four);
		cursor: pointer;
		user-select: none;
		transition:
			background-color 0.4s var(--bezier-one),
			color 0.3s var(--bezier-one);
	}

	.package.selected {
		color: var(--primary);
		background-color: var(--tertiary);
	}

	.package:hover:not(.selected) {
		background-color: var(--surface-seven);
		color: var(--text-one);
	}

	@media (max-width: 768px) {
		.package {
			border-radius: 0;
			font-size: 0.9rem;
			padding: 1rem;
			word-break: break-all;
			overflow: hidden;
			text-overflow: ellipsis;
			border-bottom: 1px solid var(--border);
		}
	}
</style>
