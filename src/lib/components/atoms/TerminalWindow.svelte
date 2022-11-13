<div class="terminal-container">
hhh
</div>

<style>
    .terminal-container {
        padding: 1rem;
        height: 500px;
        width: 700px;
        background-color: var(--grey-six);
        position: fixed;
        z-index: -2;
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);    
        right: 100px;
        border-radius: 1rem;
        border: 1px solid var(--grey-three)
    }

    @media (max-width: 1700px) {
		.terminal-container {
			position: fixed;
			height: 100vh;
            overflow: hidden;
			top: 115px;
			right: 6rem;
		}
	}
</style>