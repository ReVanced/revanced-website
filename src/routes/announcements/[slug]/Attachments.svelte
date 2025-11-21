<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import { isValidUrl } from '$util/isValidUrl';
	import Create from 'svelte-material-icons/Plus.svelte';
	import Delete from 'svelte-material-icons/DeleteOutline.svelte';

	export let isEditing: boolean;
	export let isCreating: boolean;
	export let isPreviewing: boolean;
	export let attachments: string[] | undefined;
	export let attachmentsInput: string[] | undefined;

	let newAttachment: string | null = null;

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

	$: displayAttachments = isPreviewing ? attachmentsInput : attachments;
</script>

{#if (isEditing || isCreating) && !isPreviewing}
	<Divider horizontalPadding={0} />
	<div class="attachments-wrapper">
		{#if attachmentsInput}
			{#each attachmentsInput as attachment, index}
				<div class="attachments">
					<input
						bind:value={attachmentsInput[index]}
						class:empty={!attachment || !isValidUrl(attachment)}
						placeholder="Attachment URL"
					/>
					<button
						class:last={index == attachmentsInput.length - 1}
						on:click={() => removeAttachment(index)}
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
				on:blur={() => {
					addAttachment(newAttachment);
					newAttachment = null;
				}}
				on:keydown={(event) => {
					if (event.key === 'Enter' && addAttachment(newAttachment)) newAttachment = null;
				}}
			/>
			<span>
				<Button icon={Create} />
			</span>
		</span>
	</div>
{:else if displayAttachments && displayAttachments?.length > 0}
	<Divider horizontalPadding={0} />
	<Gallery images={displayAttachments} />
{/if}

<style>
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
	}

	input:focus {
		outline: none;
		border: 1px solid var(--primary);
	}

	input.empty {
		border: 1px solid var(--red-one);
	}

	#new-attachment {
		display: inline-flex;
		align-items: center;
		position: relative;
	}

	#new-attachment input {
		width: 52px;
		border: 1px solid var(--border);
		padding-right: 0;
	}

	#new-attachment input:focus {
		width: 100%;
	}

	#new-attachment input:focus + span {
		display: none;
	}

	#new-attachment input:focus.empty {
		border: 1px solid var(--red-one);
	}

	#new-attachment span {
		pointer-events: none;
		position: absolute;
		left: 15.5px;
	}

	.attachments-wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 1rem;
	}

	.attachments-wrapper .attachments {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		gap: 1rem;
	}

	.attachments-wrapper .attachments button {
		position: absolute;
		right: 10px;
		top: 14px;
	}
</style>
