<div class="menu">
	<h6>PACKAGES</h6>
	<hr/>
	<div class="slot">
		<slot />
	</div>
</div>

<style>
	.menu {
		height: calc(100vh - 60px);
		width: 100%;
		padding: 0px 30px 30px 10px;
		display: flex;
		flex-direction: column;
		position: sticky;
		top: 60px;
		padding-top: calc(6rem - 60px);
		overflow-y: scroll;
	}

	.menu::-webkit-scrollbar-thumb {
		background-color: transparent;
	}
	.menu:hover::-webkit-scrollbar-thumb {
		background-color: var(--accent-color);
	}

	.slot {
		margin-top: 0.75rem;
		display: flex;
		gap: 1rem;
		flex-direction: column;
		white-space: normal;
		word-break: break-all;
	}

	h6 {
		margin-bottom: 1rem;
		color: var(--accent-color);
	}

	@media (max-width: 768px) {
		.menu {
			padding: 0.75rem;
			height: unset;
		}

		h6, hr {
			display: none;
		}
	}
</style>
