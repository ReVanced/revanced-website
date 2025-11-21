<script lang="ts">
	import ToolTip from './ToolTip.svelte';

	export let type: 'filled' | 'tonal' | 'text' | 'outlined' | 'icon' = 'filled';
	export let variant: 'default' | 'danger' | 'onDangerBackground' = 'default';
	export let functionType: typeof HTMLButtonElement.prototype.type = 'button';
	export let icon: any | undefined = undefined;
	export let iconSize = 20;
	export let iconColor = 'currentColor';
	export let href: string = '';
	export let target: string = '';
	export let label: string = '';
	export let disabled: boolean = false;
	export let toolTipText: string | undefined = undefined;
	export let style: string = '';

	$: type = $$slots.default ? type : 'icon';
</script>

<ToolTip content={toolTipText} html={false}>
	{#if href}
		<a {href} {target} aria-label={label} class={`${type} ${variant}`} class:disabled>
			<svelte:component this={icon} size={iconSize} color={iconColor} />
			<slot />
		</a>
	{:else}
		<button
			on:click
			class={`${type} ${variant}`}
			style="{style}"
			class:disabled
			aria-label={label}
			type={functionType}
			{disabled}
		>
			<svelte:component this={icon} size={iconSize} color={iconColor} />
			<slot />
		</button>
	{/if}
</ToolTip>

<style>
	a,
	button {
		min-width: max-content;
		font-size: 0.9375rem;
		text-decoration: none;
		color: var(--text-one);
		font-weight: 600;
		letter-spacing: -0.005em;
		border: none;
		border-radius: 12px;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		transition:
			transform var(--transition-base) var(--bezier-one),
			box-shadow var(--transition-base) var(--bezier-one),
			background-color var(--transition-base) var(--bezier-one),
			color var(--transition-base) var(--bezier-one);
		user-select: none;
		padding: 14px 24px;
		-webkit-font-smoothing: antialiased;
	}

	/* Ripple effect on click */
	a::before,
	button::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.15);
		transform: translate(-50%, -50%);
		transition: width 0.6s, height 0.6s;
		pointer-events: none;
	}

	a:active::before,
	button:active::before {
		width: 300px;
		height: 300px;
	}

	a:hover:not(.disabled),
	button:hover:not(.disabled) {
		transform: translateY(-1px);
	}

	a:active:not(.disabled),
	button:active:not(.disabled) {
		transform: translateY(0);
	}

	a.disabled,
	button.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		filter: grayscale(40%);
	}

	/* Filled Style - Primary action button */
	a.filled,
	button.filled {
		background: linear-gradient(135deg, var(--primary) 0%, var(--primary-pressed) 100%);
		color: #FFFFFF;
		box-shadow: 0 4px 12px rgba(139, 127, 255, 0.3),
					0 2px 4px rgba(0, 0, 0, 0.2);
	}

	a.filled:hover:not(.disabled),
	button.filled:hover:not(.disabled) {
		box-shadow: 0 6px 20px rgba(139, 127, 255, 0.4),
					0 4px 8px rgba(0, 0, 0, 0.25);
	}

	a.filled:active:not(.disabled),
	button.filled:active:not(.disabled) {
		box-shadow: 0 2px 8px rgba(139, 127, 255, 0.3),
					0 1px 2px rgba(0, 0, 0, 0.2);
	}

	/* Tonal Style - Secondary action */
	a.tonal,
	button.tonal {
		background-color: var(--surface-three);
		color: var(--primary);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}

	a.tonal:hover:not(.disabled),
	button.tonal:hover:not(.disabled) {
		background-color: var(--surface-four);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	/* Text Style - Tertiary action */
	a.text,
	button.text {
		background-color: transparent;
		color: var(--primary);
		font-weight: 600;
		padding: 8px 16px;
		box-shadow: none;
	}

	a.text:hover:not(.disabled),
	button.text:hover:not(.disabled) {
		background-color: var(--tertiary);
		transform: none;
	}

	/* Outlined Style - Alternative action */
	a.outlined,
	button.outlined {
		border: 2px solid var(--primary);
		background-color: transparent;
		color: var(--primary);
	}

	a.outlined:hover:not(.disabled),
	button.outlined:hover:not(.disabled) {
		background-color: var(--tertiary);
		box-shadow: 0 4px 12px rgba(139, 127, 255, 0.2);
	}

	/* Icon Style - Icon-only button */
	a.icon,
	button.icon {
		background-color: transparent;
		color: currentColor;
		padding: 8px;
		border-radius: 10px;
	}

	a.icon:hover:not(.disabled),
	button.icon:hover:not(.disabled) {
		background-color: var(--surface-three);
		transform: scale(1.05);
	}

	a.icon:active:not(.disabled),
	button.icon:active:not(.disabled) {
		transform: scale(0.95);
	}

	/* Danger Variant */
	a.danger,
	button.danger {
		background: linear-gradient(135deg, var(--error) 0%, #DC2626 100%);
		color: #FFFFFF;
		box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
	}

	a.danger:hover:not(.disabled),
	button.danger:hover:not(.disabled) {
		box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
	}

	/* On Danger Background Variant */
	a.onDangerBackground,
	button.onDangerBackground {
		background-color: #FEE2E2;
		color: #991B1B;
	}

	a.onDangerBackground:hover:not(.disabled),
	button.onDangerBackground:hover:not(.disabled) {
		background-color: #FECACA;
	}
</style>
