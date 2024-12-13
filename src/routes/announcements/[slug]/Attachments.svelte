<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import Gallery from '$lib/components/Gallery.svelte';

	export let isEditing: boolean;
	export let isCreating: boolean;
	export let isPreviewing: boolean;
	export let attachments: string[] | undefined;
	export let attachmentsElement: string[];

	const addAttachment = () => {
		attachments = [...(attachments ?? []), ''];
	};

	const removeAttachment = (index: number) => {
		if (!attachments) return;

		attachments = attachments.filter((_, i) => i !== index);
	};

	$: attachments = isPreviewing ? attachmentsElement : attachments;
</script>

{#if (isEditing || isCreating) && !isPreviewing}
	<Divider />
	<div class="attachments-wrapper">
		{#if attachmentsElement}
			{#each attachmentsElement as attachment, index}
				<div class="attachments">
					<input
						bind:value={attachmentsElement[index]}
						class:empty={attachment === ''}
						placeholder="Attachment URL"
					/>
					<button
						class:last={index == attachmentsElement.length - 1}
						on:click={() => removeAttachment(index)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="24px"
							viewBox="0 -960 960 960"
							width="24px"
							fill="#adc8df"
						>
							<path
								d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
							/>
						</svg>
					</button>
					{#if index == attachmentsElement.length - 1}
						<span>
							<Button type="icon" icon="create" on:click={addAttachment} />
						</span>
					{/if}
				</div>
			{/each}
		{/if}
		{#if !attachmentsElement || attachmentsElement.length == 0}
			<span>
				<Button type="icon" icon="create" on:click={addAttachment} />
			</span>
		{/if}
	</div>
{:else if attachments && attachments.length > 0}
	<Divider />
	<Gallery images={attachments} />
{/if}

<style lang="scss">
	button {
		display: flex;
		justify-content: center;
		background-color: transparent;
		border: none;
		cursor: pointer;

		svg {
			margin: 0;
		}
	}

	.attachments-wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 1rem;

		.attachments {
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			gap: 1rem;

			input {
				width: 100%;
			}

			button {
				position: absolute;
				right: 10px;
				top: 14px;
				&.last {
					right: 45px;
				}
			}
		}

		.empty {
			border: 1px solid var(--red-one);

			&:focus {
				outline: none;
				border: 1px solid var(--primary);
			}
		}
	}
</style>
