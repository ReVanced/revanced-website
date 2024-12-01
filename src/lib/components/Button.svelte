<script lang="ts">
	export let type: 'filled' | 'tonal' | 'text' | 'outlined' | 'icon';
	export let functionType: typeof HTMLButtonElement.prototype.type = 'button';
	export let icon = '';
	export let href = '';
	export let target = '';
	export let label = '';
	export let disabled = false;
	export let danger = false;
</script>

{#if href}
	{#if type == 'icon'}
		<a {href} {target} aria-label={label}>
			{#if icon}
				<img src="../icons/{icon}.svg" alt={icon} />
			{/if}
		</a>
	{:else}
		<a {href} {target} class={`button-${type}`} class:disabled class:danger aria-label={label}>
			{#if icon}
				<img src="../icons/{icon}.svg" alt={icon} />
			{/if}
			<slot />
		</a>
	{/if}
{:else if type == 'icon'}
	<img on:click src="../icons/{icon}.svg" alt={icon} aria-label={label} />
{:else}
	<button
		on:click
		class={`button-${type}`}
		class:disabled
		class:danger
		aria-label={label}
		type={functionType}
		{disabled}
	>
		{#if icon}
			<img src="../icons/{icon}.svg" alt={icon} />
		{/if}
		<slot />
	</button>
{/if}

<style>
	button {
		border: none;
		background-color: transparent;
		padding: 0;
		margin: 0;
	}

	a,
	button {
		min-width: max-content;
		font-size: 0.95rem;
		text-decoration: none;
		color: var(--text-one);
		font-weight: 600;
		border: none;
		border-radius: 100px;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		transition:
			transform 0.4s var(--bezier-one),
			filter 0.4s var(--bezier-one);
		user-select: none;
	}

	.button-filled {
		background-color: var(--primary);
		color: var(--text-three);
	}
	.button-filled.danger {
		background-color: var(--red-one);
		color: var(--surface-four);
	}

	.button-tonal {
		background-color: var(--surface-four);
	}
	.button-tonal.danger {
		color: var(--red-one);
		border: 2px solid var(--red-one);
	}

	.button-filled,
	.button-tonal,
	.button-outlined {
		padding: 16px 24px;
	}

	.button-text {
		background-color: transparent;
		color: var(--primary);
		font-weight: 500;
		letter-spacing: 0.01rem;
	}
	.button-text.danger {
		color: var(--red-one);
	}

	.button-outlined {
		border: 2px solid var(--primary);
		color: var(--text-one);
		background-color: transparent;
	}
	.button-outlined.danger {
		border-color: var(--red-one);
		color: var(--red-one);
	}

	button:hover,
	a:hover {
		filter: brightness(85%);
	}

	.disabled,
	:hover.disabled {
		filter: grayscale(100%);
		cursor: not-allowed;
	}

	a.disabled,
	a:hover.disabled {
		pointer-events: none;
	}

	img {
		height: 20px;
	}
</style>
