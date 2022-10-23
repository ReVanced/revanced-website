<script lang="ts">
	export let title: string;
</script>

<div class="menu">
	<h5>{title.toUpperCase()}</h5>
	<hr />
	<div class="package-list">
		<slot />
	</div>
</div>

<style>
	.menu {
		height: calc(100vh - 7.5rem);
		width: 100%;
		padding: 0px 10px 30px 10px;
		display: flex;
		flex-direction: column;
		position: sticky;
		top: 7.5rem;
		overflow-y: scroll;
	}

	h5 {
		font-weight: 500;
	}

	hr {
		margin-top: 0.75rem;
		display: block;
		height: 1px;
		border: 0;
		border-top: 1px solid var(--grey-three);
	}

	.package-list {
		margin-top: 0.75rem;
		display: flex;
		flex-direction: column;
		white-space: normal;
		word-break: break-all;
	}

	/* .package-list:has(.loading) {
        padding-top: 7.5rem;
    } */
</style>
