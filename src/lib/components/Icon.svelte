<script lang="ts">
	export let name: string;
</script>

<span class="material-symbols-outlined" {...$$restProps}>{name}</span>

<style>
	.material-symbols-outlined {
		font-variation-settings:
			'FILL' 0,
			'wght' 400,
			'GRAD' 0,
			'opsz' 24;
	}
</style>
