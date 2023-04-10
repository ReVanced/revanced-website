<script lang="ts">
	export let logoUrl: string;
	export let votes: number;
</script>

<!-- SHUT UP -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div class="option" tabindex="0">
	<div class="row">
		<!-- Screenreader compatibility does not make sense in this context. -->
		<img src={logoUrl} alt="" />
	</div>
	<div class="actions">
		<h3>Votes: {votes}</h3>
	</div>
</div>

<style>
	.option {
		border: 1.5px solid var(--grey-three);
		width: 100%;
		color: var(--white);
		transition: all 0.3s var(--bezier-one);
		border-radius: 16px;
		background-color: var(--grey-six);
		text-decoration: none;
		cursor: pointer;
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.25rem;
		gap: 1.5rem;
		cursor: pointer;
	}

	.actions {
		border-top: 1px solid var(--grey-three);
		display: flex;
		flex-direction: row;
		padding: 1rem 1.25rem;
		align-items: center;
		border-radius: 0 0 16px 16px;
		justify-content: space-between;
		pointer-events: none;
	}
	.option:hover {
		filter: brightness(0.85);
	}

	img {
		border-radius: 8px;
		height: 125px;
		max-width: 125px;
		transition: transform 0.4s var(--bezier-one);
		user-select: none;
	}
</style>
