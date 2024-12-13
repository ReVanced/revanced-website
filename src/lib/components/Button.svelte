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
	<a {href} {target} aria-label={label} class={type} class:disabled class:danger>
		{#if icon}
			<img src={`../icons/${icon}.svg`} alt={icon} />
		{/if}
		{#if type !== 'icon'}
			<slot />
		{/if}
	</a>
{:else}
	<button
		on:click
		class={type}
		class:disabled
		class:danger
		aria-label={label}
		type={functionType}
		{disabled}
	>
		{#if icon}
			<img src="../icons/{icon}.svg" alt={icon} />
		{/if}
		{#if type !== 'icon'}
			<slot />
		{/if}
	</button>
{/if}

<style lang="scss">
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
		padding: 16px 24px;

		&:hover:not(.disabled) {
			filter: brightness(85%);
		}

		&.disabled {
			filter: grayscale(100%);
			cursor: not-allowed;
		}

		&.filled {
			background-color: var(--primary);
			color: var(--text-three);
		}

		&.tonal {
			background-color: var(--surface-four);
		}

		&.text {
			background-color: transparent;
			color: var(--primary);
			font-weight: 500;
			padding: 0;
		}

		&.outlined {
			border: 2px solid var(--primary);
			background-color: transparent;
		}

		&.icon {
			&:hover {
				filter: brightness(75%);
			}
			background-color: transparent;
			padding: 0;
		}

		&.danger {
			background-color: var(--red-one);
			color: var(--surface-four);
		}

		img {
			height: 20px;
		}
	}
</style>
