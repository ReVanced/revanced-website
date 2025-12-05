<script lang="ts">
	import type { WithChildren } from '$types';


	type Props = {
		title: string;
		sectionRef?: HTMLElement | null;
	} & WithChildren;

	let { title, children, sectionRef = $bindable(null) }: Props = $props();
</script>

<div class="footer-section" bind:this={sectionRef}>
	<span class="section-title">{title}</span>
	<ul class="section-links">
		{@render children()}
	</ul>
</div>

<style>
	.footer-section {
		display: flex;
		flex-direction: column;
	}

	.section-title {
		display: flex;
		margin-bottom: 1.5rem;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-four);
	}

	.section-links {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 0;
		list-style: none;
	}

	@media (max-width: 768px) {
		.footer-section {
			padding: 1.5rem 0;
		}

		.footer-section:not(:last-child) {
			border-bottom: 1px solid var(--border);
		}

		.section-title {
			margin-bottom: 1rem;
		}
	}
</style>
