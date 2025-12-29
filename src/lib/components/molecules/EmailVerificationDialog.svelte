<script lang="ts">
	import Modal from '$components/molecules/Modal.svelte';
	import Button from '$components/atoms/Button.svelte';

	type Props = {
		open?: boolean;
		email: string;
	};

	let { open = $bindable(false), email }: Props = $props();

	const VERIFICATION_KEYWORD = 'reficio';
	const COUNTDOWN_SECONDS = 15;

	let keyword = $state('');
	let countdown = $state(COUNTDOWN_SECONDS);
	let countdownInterval: ReturnType<typeof setInterval> | null = null;

	$effect(() => {
		if (open && !countdownInterval && countdown !== 0) {
			countdownInterval = setInterval(() => {
				if (countdown <= 0) {
					clearCountdownInterval();
					return;
				}
				countdown -= 1;
			}, 1000);
		}

		return () => {
			clearCountdownInterval();
		};
	});

	function clearCountdownInterval() {
		if (countdownInterval) {
			clearInterval(countdownInterval);
			countdownInterval = null;
		}
	}

	function closeDialog() {
		open = false;
		clearCountdownInterval();
		countdown = COUNTDOWN_SECONDS;
		keyword = '';
	}

	let isKeywordCorrect = $derived(keyword.toLowerCase() === VERIFICATION_KEYWORD);
</script>

<Modal
	bind:open
	title="Abuse notice"
	onclose={closeDialog}
>
	{#snippet description()}
		This E-Mail address is <b>not</b> for support, help, bug reports or feature requests. It must
		have a subject and body and have the keyword <span class="keyword-hint">'Reficio'</span>
		in either, otherwise your mail will be <b>ignored</b>.
	{/snippet}

	<div class="content-area">
		{#if countdown === 0}
			<span>Enter the keyword, then click "Send".</span>
			<br /><br />
			<div class="input-wrapper">
				<input
					id="keyword"
					name="keyword"
					type="text"
					required
					bind:value={keyword}
				/>
				<label for="keyword">Keyword</label>
			</div>
		{:else}
			<span>Read above and wait <b>{countdown}</b> seconds.</span>
		{/if}
	</div>

	{#snippet buttons()}
		{#if isKeywordCorrect}
			<Button buttonStyle="text">
				<a href="mailto:{email}" class="send-link">Send</a>
			</Button>
		{/if}
		<Button buttonStyle="filled" onclick={closeDialog}>Close</Button>
	{/snippet}
</Modal>

<style>
	.content-area {
		width: 100%;
		color: var(--text-four);
		line-height: 1.6;
	}

	.content-area b {
		color: var(--text-four);
	}

	:global(.keyword-hint) {
		user-select: none;
	}

	.send-link {
		text-decoration: none;
		color: var(--text-four);
		font-weight: 600;
	}

	.send-link:hover {
		color: var(--text-one);
	}

	/* Input styling to match old project */
	.input-wrapper {
		width: 100%;
		position: relative;
	}

	.input-wrapper label {
		position: absolute;
		top: 29%;
		left: 1rem;
		transition: all 0.2s ease-in-out;
		color: var(--surface-six);
		pointer-events: none;
		padding: 0;
		margin: 0;
		font-size: 1rem;
	}

	.input-wrapper input {
		font-size: 1rem;
		width: 100%;
		padding: 1rem;
		border-radius: 12px;
		border: 1px solid var(--border);
		background-color: transparent;
		color: var(--secondary);
		box-sizing: border-box;
	}

	.input-wrapper input:focus {
		outline: 1px solid var(--primary);
	}

	.input-wrapper input:focus + label,
	.input-wrapper input:valid + label {
		top: -0.65rem;
		font-size: 0.85rem;
		background-color: var(--surface-seven);
		color: var(--text-one);
		padding: 0 0.3rem;
	}
</style>
