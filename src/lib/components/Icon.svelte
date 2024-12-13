<script lang="ts">
	export let name: string;
	export let filled: boolean = false;

	name = name.toLowerCase();

	const filledValue = filled ? 1 : 0;
</script>

<span class="material-symbols-outlined" style="--filled: {filledValue};">
	{name}
</span>

<style>
	.material-symbols-outlined {
		font-variation-settings:
			'FILL' var(--filled),
			'wght' 400,
			'GRAD' 0,
			'opsz' 24;
	}
</style>
