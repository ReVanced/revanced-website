<script lang="ts">
	export let title: string;
    export let searchTerm: string;
</script>

<div>
	<img src="../icons/search.svg" alt="Search" />
	<input type="text" placeholder={title} bind:value={searchTerm} />
</div>

<style>
	img {
		position: absolute;
		height: 20px;
		transform: translate(60%, 60%);
	}

	input {
		position: relative;
		display: flex;
		padding: 0.75rem 1rem;
		border-radius: 12px;
		border: 1px solid var(--grey-three);
		background-color: transparent;
		color: var(--grey-five);
		padding-left: 2.5rem;
        width: 100%;
	}
	input::placeholder {
		color: var(--grey-five);
	}

	input:focus {
		outline: 1px solid var(--accent-color);
	}
</style>
