<script lang="ts">
	import type { WithChildren } from '$types';

	type Props = { description?: string } & WithChildren;
	let { description, children }: Props = $props();
</script>

<svelte:head>
	<title>{`ReVanced ${description ? `- ${description.trim()}` : ''}`.trim()}</title>
</svelte:head>

{@render children()}
