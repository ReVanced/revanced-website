<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import isValidUrl from './utils';

	export let isEditing: boolean;
	export let isCreating: boolean;
	export let isPreviewing: boolean;
	export let attachments: string[] | undefined;
	export let attachmentsInput: string[] | undefined;

	let newAttachment: string | null = null;

	const isValidAnnouncement = (attachment: string | null) => {
		return attachment && attachment && isValidUrl(attachment);
	};

	const addAttachment = (attachment: string | null) => {
		if (!isValidAnnouncement(attachment)) return;

		attachmentsInput = [...(attachmentsInput ?? []), attachment ? attachment : ''];
	};

	const removeAttachment = (index: number) => {
		if (!attachmentsInput) return;

		attachmentsInput = attachmentsInput.filter((_, i) => i !== index);
	};

	$: displayAttachments = isPreviewing ? attachmentsInput : attachments;
</script>

{#if (isEditing || isCreating) && !isPreviewing}
	<Divider />
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
					if (event.key === 'Enter') {
						addAttachment(newAttachment);
						newAttachment = null;
					}
				}}
			/>
			<span>
				<Button type="icon" icon="create" />
			</span>
		</span>
	</div>
{:else if displayAttachments && displayAttachments?.length > 0}
	<Divider />
	<Gallery images={displayAttachments} />
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
