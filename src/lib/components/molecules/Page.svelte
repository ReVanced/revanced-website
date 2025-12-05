<script lang="ts">
	import type { WithChildren } from '$types';


	type Props = {
		title?: string;
		description?: string;
	} & WithChildren;

	let { title, description, children }: Props = $props();

	let pageTitle = $derived.by(() => {
		if (title) return `ReVanced - ${title}`;
		if (description) return `ReVanced - ${description.trim()}`;
		return 'ReVanced';
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

{@render children()}
