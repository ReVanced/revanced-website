<script lang="ts">
	import { fade } from 'svelte/transition';
	import { quadInOut } from 'svelte/easing';
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

{#if open}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="overlay"
		transition:fade={{ easing: quadInOut, duration: 150 }}
	></div>

	<dialog
		class="dialog"
		aria-modal="true"
		transition:fade={{ easing: quadInOut, duration: 150 }}
	>
		<div class="title">
			<h3>Abuse notice</h3>
		</div>

		<div class="description">
			<p>
				This E-Mail address is <b>not</b> for support, help, bug reports or feature requests. It must
				have a subject and body and have the keyword <span class="keyword-hint">'Reficio'</span>
				in either, otherwise your mail will be
				<b>ignored</b>.
			</p>
			<br />
			{#if countdown === 0}
				<span>Enter the keyword, then click "Send".</span>
				<br />
				<br />
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

		<div class="buttons">
			{#if isKeywordCorrect}
				<Button buttonStyle="text">
					<a href="mailto:{email}" class="send-link">Send</a>
				</Button>
			{/if}
			<Button buttonStyle="filled" onclick={closeDialog}>Close</Button>
		</div>
	</dialog>
{/if}

<style>
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: var(--z-modal-backdrop);
	}

	.dialog {
		position: fixed;
		width: min(85%, 425px);
		max-height: 75%;
		overflow-y: auto;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border: none;
		border-radius: 26px;
		background-color: var(--surface-seven);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		z-index: var(--z-modal);
		padding: 32px;
		box-shadow:
			0px 4px 5px 0px rgba(0, 0, 0, 0.14),
			0px 1px 10px 0px rgba(0, 0, 0, 0.12),
			0px 2px 4px -1px rgba(0, 0, 0, 0.2);
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.dialog::-webkit-scrollbar {
		display: none;
	}

	.title {
		display: flex;
		align-items: center;
		gap: 1rem;
		width: 100%;
	}

	.title h3 {
		margin: 0;
		color: var(--secondary);
		font-size: 1.25rem;
	}

	.description {
		width: 100%;
		color: var(--text-four);
		line-height: 1.6;
	}

	.description p {
		margin: 0;
	}

	.description b {
		color: var(--text-four);
	}

	.keyword-hint {
		user-select: none;
	}

	.buttons {
		display: flex;
		gap: 2rem;
		justify-content: flex-end;
		width: 100%;
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
