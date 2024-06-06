<div class="menu">
	<div class="header">
		<h6>Packages</h6>
		<hr />
	</div>
	<div class="slot">
		<slot />
	</div>
</div>

<style>
	.menu {
		height: calc(100vh - 10.5rem);
		width: 100%;
		padding: 0px 30px 0px 10px;
		display: flex;
		flex-direction: column;
		overflow-y: scroll;
	}

	.menu::-webkit-scrollbar-thumb {
		background-color: transparent;
	}
	.menu:hover::-webkit-scrollbar-thumb {
		background-color: var(--accent-color);
	}

	.header {
		padding-top: calc(6rem - 64px);
		position: sticky;
		top: 0;
		background-color: var(--bg-color);
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

	@media (max-width: 767px) {
		.menu {
			padding: 0.75rem;
			height: unset;
		}

		h6,
		hr {
			display: none;
		}
	}
</style>
