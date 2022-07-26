<script>
	export let src = 'socials/github.svg';
    export let alt = 'GitHub';
    export let href = '#';
</script>

<button>
    <a {href}>
        <img {src} {alt}>
    </a>
</button>

<style>
	button {
		color: var(--white);
		border-radius: 200px;
        border: 0;
		padding: 14px;
        width:60px;
        height:60px;
		cursor: pointer;
		background-color: var(--grey-four);
		font-size: 1.5rem;
		transition: transform 0.4s var(--bezier-one), filter 0.4s var(--bezier-one);
		user-select: none;
        margin-right:0.5rem;
		margin-left: 0.5rem;
	}

    img {
        width:30px;
    }

	button:hover {
		transform: translate(0%, -5%);
	}

	button:hover img {
		filter: brightness(1.2);
	}
</style>
