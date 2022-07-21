<script>
    import Button from '$lib/components/atoms/Button.svelte';
</script>

<div class="download-selection">
    <h1>2.5.0</h1>
    <h4>2022-07-11</h4>
    <div class="info">
        <div class='rounded-fill'><h3>Features</h3></div>
        <ul>
            <li><h5>feature request issue template <a href="https://github.com/revanced/revanced-patcher/commit/112bc998f4761a647cb9eab7454e35264fa96fd9">(1b39278)</a></h5></li>
            <li><h5>issue templates [skip ci] <a href="https://github.com/revanced/revanced-patcher/commit/112bc998f4761a647cb9eab7454e35264fa96fd9">(112bc99)</a></h5></li>
        </ul>
        <div class='rounded-fill'><h3>Bug Fixes</h3></div>
        <ul>
            <li><h5>missing additional items [skip ci] <a href="https://github.com/revanced/revanced-patcher/commit/0ebab8bf598d993df6e340651205cba48f1ef725">(0ebab8b)</a></h5></li>
        </ul>
    </div>
    <div class="button">
        <Button>Download</Button>
    </div>
</div>

<style>
	.download-selection {
		background-color: var(--grey-two);
		border-radius: 15px;
        justify-content: center;
		height:100%;
        min-width:250px;
	}

    h1 {
        text-align: center;
        margin-top: 1.4rem;
        font-weight: 700;
    }
    
    h3 {
        text-align: left;
    }

    h4 {
        text-align: center;
    }
    
    .rounded-fill {
        display:inline-block;
        border-radius: 200px;
        margin-left: 1rem;
        padding: 0.4rem 0.75rem;
        background-color: var(--grey-three);
    }

    .info{
        margin-top: 1rem;
        overflow-y: scroll;
        margin-right: 0.5rem;
        -webkit-mask-image: linear-gradient(180deg, #000 70%, transparent);
        height:30vh;
    }



    ul {
        margin-top: 0.5rem;
        margin-left:3rem;
        margin-bottom:1rem;
        line-height: 1.5rem;
    }

    li {
        color:var(--white);
    }

    ul a {
        text-decoration: none;
        color:var(--red);
    }

    .button {
        display:flex;
        justify-content: center;
        margin-top: -1.5rem;
        margin-bottom: 1.5rem;
    }

</style>
