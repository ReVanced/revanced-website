<script lang="ts">
	import Button from '$ui/Button.svelte';
	import Divider from '$ui/Divider.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import { isValidUrl } from '$utils/isValidUrl';
	import Create from 'svelte-material-icons/Plus.svelte';
	import Delete from 'svelte-material-icons/DeleteOutline.svelte';

	let {
		isEditing,
		isCreating,
		isPreviewing,
		attachments,
		attachmentsInput = $bindable()
	}: {
		isEditing: boolean;
		isCreating: boolean;
		isPreviewing: boolean;
		attachments: string[] | undefined;
		attachmentsInput: string[] | undefined;
	} = $props();

	let newAttachment: string | null = $state(null);

	const isValidAnnouncement = (attachment: string | null) => {
		return attachment && isValidUrl(attachment);
	};

	const addAttachment = (attachment: string | null) => {
		if (!isValidAnnouncement(attachment)) return;

		attachmentsInput = [...(attachmentsInput ?? []), attachment!];
		return true;
	};

	const removeAttachment = (index: number) => {
		if (!attachmentsInput) return;

		attachmentsInput = attachmentsInput.filter((_, i) => i !== index);
	};

	let displayAttachments = $derived(isPreviewing ? attachmentsInput : attachments);
</script>

{#if (isEditing || isCreating) && !isPreviewing}
	<Divider horizontalPadding="0" />
	<div class="attachments-wrapper">
		{#if attachmentsInput}
			{#each attachmentsInput as attachment, index}
				<div class="attachments">
					<input
						bind:value={attachmentsInput[index]}
						class:empty={!attachment || (attachment && !isValidUrl(attachment))}
						placeholder="Attachment URL"
					/>
					<button
						class:last={index == attachmentsInput.length - 1}
						onclick={() => removeAttachment(index)}
					>
						<Delete size="24" color="var(--text-four)" />
					</button>
				</div>
			{/each}
		{/if}
		<span id="new-attachment">
			<input
				bind:value={newAttachment}
				class:empty={!isValidAnnouncement(newAttachment)}
				onblur={() => {
					addAttachment(newAttachment);
					newAttachment = null;
				}}
				onkeydown={(event) => {
					if (event.key === 'Enter' && addAttachment(newAttachment)) newAttachment = null;
				}}
			/>
			<span>
				<Button icon={Create} />
			</span>
		</span>
	</div>
{:else if displayAttachments && displayAttachments?.length > 0}
	<Divider horizontalPadding="0" />
	<Gallery images={displayAttachments} />
{/if}

<style lang="scss">
	button {
		display: flex;
		justify-content: center;
		background-color: transparent;
		border: none;
		cursor: pointer;
	}

	input {
		width: 100%;
		padding-right: 40px;
		letter-spacing: 0.02rem;
		font-size: 0.85rem;
		transition: all 0.2s var(--bezier-one);

		&:focus {
			outline: none;
			border: 1px solid var(--primary);
		}

		&.empty {
			border: 1px solid var(--red-one);
		}
	}

	#new-attachment {
		display: inline-flex;
		align-items: center;
		position: relative;

		input {
			width: 52px;
			border: 1px solid var(--border);
			padding-right: 0;

			&:focus {
				width: 100%;
				+ span {
					display: none;
				}

				&.empty {
					border: 1px solid var(--red-one);
				}
			}
		}

		span {
			pointer-events: none;
			position: absolute;
			left: 15.5px;
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

			button {
				position: absolute;
				right: 10px;
				top: 14px;
			}
		}
	}
</style>
