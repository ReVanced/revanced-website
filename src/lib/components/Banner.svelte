<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Close from 'svelte-material-icons/Close.svelte';
	import ArrowRight from 'svelte-material-icons/ArrowRight.svelte';
	import Button from './Button.svelte';

	export let title: string;
	export let description: string | undefined = undefined;
	export let buttonText: string | undefined = undefined;
	export let buttonOnClick: any | undefined = undefined;
	export let level: 'info' | 'caution' = 'info';
	export let permanent: boolean = false;
	export let onDismiss: () => void = () => {};

	const dispatch = createEventDispatcher();
	let closed: boolean = false;

	function getVariant(level: string): 'default' | 'onDangerBackground' {
		return level === 'caution' ? 'onDangerBackground' : 'default';
	}

	const dismiss = () => {
		if (onDismiss) onDismiss();
		closed = true;
		dispatch('dismissed');
	};
</script>

{#if !closed}
	<div class="banner {level}" class:permanent>
		<div class="text">
			<h1 id="title">{title}</h1>
			<h2 id="description">{description}</h2>
		</div>
		<div class="actions">
			{#if !permanent}
				<Button type={'icon'} icon={Close} on:click={dismiss} />
			{/if}
			{#if buttonText && buttonOnClick}
				<Button variant={getVariant(level)} on:click={buttonOnClick}>
					{buttonText}
					<ArrowRight />
				</Button>
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	#title {
		line-height: 26px;
		color: currentColor;
		font-size: 20px;
	}

	#description {
		line-height: 20px;
		color: currentColor;
		font-size: 14px;
	}

	.banner {
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
		gap: 1.3rem;
		width: 100%;
		margin: 0;
		padding: 24px 40px;
		border-radius: 0;
		font-size: 0.87rem;

		&.info {
			background-color: var(--surface-four);
			color: var(--text-one);

			#description {
				color: var(--text-four);
			}
		}
		&.caution {
			background-color: var(--red-three);
			color: #601410;
		}

		@media (max-width: 767px) {
			flex-direction: column;
			padding: 1.1rem 1.3rem;
		}

		.text {
			display: flex;
			flex-direction: column;
			flex: 1;
			gap: 0.55rem;
			word-wrap: break-word;
		}

		.actions {
			display: flex;
			justify-content: end;
			gap: 1rem;
		}
	}
</style>
