<div>
	<h6>Packages</h6>
	<hr />
	<span>
		<slot />
	</span>
</div>

<style lang="scss">
	div {
		display: flex;
		flex-direction: column;
		position: sticky;

		height: calc(100vh - 60px);
		top: 60px;
		padding: calc(6rem - 60px) 30px 30px 10px;

		overflow-y: scroll;

		&::-webkit-scrollbar-thumb {
			background-color: transparent;
		}
		&:hover::-webkit-scrollbar-thumb {
			background-color: var(--primary);
		}
	}

	span {
		margin-top: 0.75rem;
		word-break: break-all;
	}

	h6 {
		margin-bottom: 1rem;
		color: var(--primary);
	}
</style>
