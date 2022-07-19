<script>
    import Button from '$lib/components/atoms/Button.svelte';
</script>

<div class="download-selection">
    <h1>99.9.9a</h1>
    <h3>2022-07-11</h3>
    <div class="info">
        <div class='rounded-fill'>
            <h2>Features</h2>
        </div>
        <ul>
            <li><h4>sn is so oococolol</h4></li>
            <li><h4>sn is so oococolol</h4></li>
            <li><h4>sn is so oococolol</h4></li>
            <li><h4>sn is so oococolol</h4></li>
            <li><h4>sn is so oococolol</h4></li>
            <li><h4>sn is so oococolol</h4></li>
            <li><h4>sn is so oococolol</h4></li>
            <li><h4>sn is so oococolol</h4></li>
            <li><h4>sn is so oococolol</h4></li>
            <li><h4>sn is so oococolol</h4></li>
            <li><h4>sn is so oococolol</h4></li>
            <li><h4>sn is so oococolol</h4></li>
            <li><h4>sn is so oococolol</h4></li>
        </ul>
    </div>
    <div class="button">
        <Button>Download</Button>
    </div>
</div>

<style>
	.download-selection {
		background-color: var(--grey-two);
		border-radius: 20px;
        justify-content: center;
		height:50vh;
	}

    h1 {
        text-align: center;
        margin-top: 1.75rem;
        font-weight: 700;
    }
    h2 {
        text-align: left;
        font-weight: 700;
        font-size:1.2rem;
    }

    .rounded-fill {
        display:inline-block;
        border-radius: 200px;
        margin-left: 1rem;
        padding: 0.5rem 1rem;
        background-color: var(--grey-three);
    }

    .info{
        margin-top: 1rem;
        overflow-y: scroll;
        margin-right: 0.5rem;
        -webkit-mask-image: linear-gradient(180deg, #000 60%, transparent);
    }

    h3 {
        font-weight:400;
        font-size: 1.2rem;
        text-align: center;
        color:var(--grey-six)
    }

    h4 {
        color: var(--white);
        font-weight: 300;
    }

    ul {
        margin-left:3rem;
        line-height: 1.5rem;
        height: 10vw;
    }

    li {
        color:var(--white)
    }

    .button {
        display:flex;
        justify-content: center;
        margin-top: -2rem;
    }

</style>
