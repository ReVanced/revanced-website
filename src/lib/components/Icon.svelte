<script lang="ts">
	import type { CSSSize } from '$lib/types';

	export let name: string;
	export let filled: boolean = false;
	export let size: CSSSize = '24px';
	export let color: string = 'inherit';

	name = name.toLowerCase();
	const filledValue = filled ? 1 : 0;
</script>

<span
	class="material-symbols-outlined"
	style="--filled: {filledValue}; font-size: {size}; color: {color};"
>
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
