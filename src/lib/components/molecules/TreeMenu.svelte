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
		height: calc(100vh - 70px);
		width: 100%;
		padding: 0px 30px 30px 10px;
		display: flex;
		flex-direction: column;
		position: sticky;
		top: 70px;
		padding-top: calc(7rem - 70px);
		overflow-y: scroll;
		border-right: 1px solid var(--grey-six);
	}

	h5 {
		font-weight: 500;
	}

	hr {
		margin-top: 0.5rem;
	}

	.package-list {
		margin-top: 0.75rem;
		display: flex;
		flex-direction: column;
		white-space: normal;
		word-break: break-all;
	}

</style>
