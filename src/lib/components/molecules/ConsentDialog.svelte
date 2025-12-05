<script lang="ts">
	import { browser } from '$app/environment';
	import { fade, fly } from 'svelte/transition';
	import Button from '$components/atoms/Button.svelte';

	const STORAGE_KEY = 'analytics_consent';
	const GTM_ID = import.meta.env.VITE_GOOGLE_TAG_MANAGER_ID ?? '';

	let visible = $state(false);
	let consent = $state<boolean | null>(null);

	$effect(() => {
		if (!browser) return;

		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === 'true') {
			consent = true;
			injectGTM();
		} else if (stored === 'false') {
			consent = false;
		} else {
			visible = true;
		}
	});

	function injectGTM() {
		if (!browser || !GTM_ID) return;

		(window as any).dataLayer = (window as any).dataLayer || [];
		(window as any).dataLayer.push({
			'gtm.start': Date.now(),
			event: 'gtm.js'
		});

		const script = document.createElement('script');
		script.async = true;
		script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
		document.head.appendChild(script);
	}

	function handleChoice(allowed: boolean) {
		if (!browser) return;

		consent = allowed;
		localStorage.setItem(STORAGE_KEY, String(allowed));
		visible = false;

		if (allowed) {
			injectGTM();
		}
	}
</script>

{#if visible}
	<div class="backdrop" transition:fade={{ duration: 200 }}>
		<div
			class="dialog"
			role="dialog"
			aria-modal="true"
			aria-labelledby="consent-title"
			in:fly={{ y: 20, duration: 300 }}
		>
			<h2 id="consent-title">Your Privacy Matters</h2>
			<p>
				We use analytics to understand how visitors use this site and improve your experience.
				By allowing analytics, you help us make ReVanced better for everyone.
			</p>
			<p class="note">
				No personal data is collected. You can change this anytime in settings.
			</p>
			<div class="actions">
				<Button buttonStyle="text" onclick={() => handleChoice(false)}>
					Deny
				</Button>
				<Button buttonStyle="filled" onclick={() => handleChoice(true)}>
					Allow Analytics
				</Button>
			</div>
		</div>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 10000;
		background-color: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	.dialog {
		background-color: var(--surface-eight);
		border: 1px solid var(--border);
		border-radius: 1.5rem;
		padding: 2rem;
		max-width: 28rem;
		width: 100%;
	}

	h2 {
		margin: 0 0 1rem;
		font-size: 1.4rem;
		color: var(--text-one);
	}

	p {
		margin: 0 0 0.75rem;
		color: var(--text-four);
		line-height: 1.6;
		font-size: 0.95rem;
	}

	.note {
		font-size: 0.85rem;
		color: var(--text-five, var(--text-four));
		opacity: 0.8;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	@media (max-width: 480px) {
		.dialog {
			padding: 1.5rem;
		}

		.actions {
			flex-direction: column-reverse;
		}

		.actions :global(button) {
			width: 100%;
		}
	}
</style>
