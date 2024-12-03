<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import Gallery from '$lib/components/Gallery.svelte';

	export let isEditing,
		isCreating,
		isPreviewing,
		removeAttachment,
		addAttachment,
		attachments,
		attachmentsElement;
</script>

{#if isEditing || isCreating}
	{#if isPreviewing}
		{#if attachmentsElement.length > 0}
			<Gallery images={attachmentsElement} />
		{/if}
	{:else}
		<Divider />
		<div>
			<div class="attachments">
				{#each attachmentsElement as attachment, index}
					<div style="position: relative; display: flex; justify-content: center;">
						<input
							style="width: 100%;"
							type="text"
							bind:value={attachmentsElement[index]}
							class:empty={attachment === ''}
							placeholder="Attachment URL"
						/>
						<button
							style="position: absolute; right: 10px; top: 14px;"
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
				<span>
					<Button type="icon" icon="create" on:click={addAttachment} />
				</span>
			</div>
		</div>
	{/if}
{:else if attachments.length > 0}
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

	.attachments {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 1rem;

		.empty {
			border: 1px solid var(--red-one);

			&:focus {
				outline: none;
				border: 1px solid var(--primary);
			}
		}
	}
</style>
