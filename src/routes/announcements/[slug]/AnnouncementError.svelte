<script lang="ts">
	interface Props {
		message?: string;
		backHref?: string;
		backLabel?: string;
	}

	let {
		message = 'Something went wrong',
		backHref = '/announcements',
		backLabel = '← Back to announcements'
	}: Props = $props();
</script>

<div class="error-state">
	<div class="error-icon">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="48"
			height="48"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<circle cx="12" cy="12" r="10" />
			<line x1="12" y1="8" x2="12" y2="12" />
			<line x1="12" y1="16" x2="12.01" y2="16" />
		</svg>
	</div>
	<p class="error-message">{message}</p>
	<a href={backHref} class="back-link">{backLabel}</a>
</div>

<style>
	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 4rem 1rem;
		min-height: 300px;
	}

	.error-icon {
		color: var(--text-four);
		opacity: 0.6;
		margin-bottom: 1rem;
	}

	.error-message {
		color: var(--text-four);
		font-size: 1.125rem;
		margin: 0;
		max-width: 40ch;
	}

	.back-link {
		display: inline-block;
		margin-top: 1.5rem;
		color: var(--primary);
		font-weight: 500;
		text-decoration: none;
		transition: color 0.2s var(--bezier-one);
	}

	.back-link:hover {
		color: var(--text-one);
		text-decoration: underline;
	}
</style>
