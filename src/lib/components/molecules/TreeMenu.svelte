<div class="menu">
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
		padding-top: calc(6rem - 70px);
		overflow-y: scroll;
	}

	.package-list {
		margin-top: 0.75rem;
		display: flex;
		gap: 1rem;
		flex-direction: column;
		white-space: normal;
		word-break: break-all;
	}
</style>
