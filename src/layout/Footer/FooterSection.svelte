<script lang="ts">
	export let title: string;
</script>

<div>
	<span>
		{title}
	</span>
	<ul>
		<slot />
	</ul>
</div>

<style lang="scss">
	span {
		display: flex;
		margin: 1.5rem 0;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-four);
	}

	ul {
		display: flex;
		flex-direction: column;
		margin: 1.25rem 0rem;
		gap: 1rem;
	}

	@media (max-width: 768px) {
		div:not(:last-child) {
			border-bottom: 1px solid var(--border);
		}
	}
</style>
