<script lang="ts">
import type { Snippet } from 'svelte';
import type { WithChildren } from '$types';
import { modalsStack } from '$stores/modals.svelte';
import { fade } from 'svelte/transition';
import { quadInOut } from 'svelte/easing';
import IconArrowLeft from 'virtual:icons/material-symbols/arrow-back';

type Props = {
id?: string;
open?: boolean;
fullscreen?: boolean;
notDismissible?: boolean;
icon?: Snippet;
title?: string;
description?: Snippet;
buttons?: Snippet;
} & WithChildren;

let {
id = crypto.randomUUID(),
open = $bindable(false),
fullscreen = false,
notDismissible = false,
icon,
title,
description,
buttons,
children
}: Props = $props();

let isTopModal = $derived(modalsStack.isTopModal(id));

let dialogElement: HTMLDialogElement | null = $state(null);
let scrollY = $state(0);

$effect(() => {
if (open) {
modalsStack.push(id, () => {
if (!notDismissible) open = false;
});
} else {
modalsStack.pop(id);
}
});

function parseScroll() {
if (dialogElement) {
scrollY = dialogElement.scrollTop;
}
}
</script>

{#if isTopModal}
<dialog
bind:this={dialogElement}
class="modal"
class:fullscreen
class:scrolled={scrollY > 10}
aria-modal="true"
onscroll={parseScroll}
onclick={(e) => e.stopPropagation()}
transition:fade={{ easing: quadInOut, duration: 150 }}
>
<div class="title" class:hasIcon={icon}>
{#if fullscreen}
<button id="back-button" type="button" onclick={() => (open = false)}>
<IconArrowLeft style="width: 24px; height: 24px; color: var(--surface-six);" />
</button>
{/if}
{#if icon}
{@render icon()}
{/if}
{#if title}
<h3>{title}</h3>
{/if}
</div>

{#if description}
<p>
{@render description()}
</p>
{/if}

<div class="slot">{@render children()}</div>

{#if buttons}
<div class="buttons">
{@render buttons()}
</div>
{/if}
</dialog>
{/if}

<style>
.modal {
position: fixed;
width: min(85%, 425px);
max-height: 75%;
overflow-y: scroll;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
border: none;
border-radius: 26px;
background-color: var(--surface-seven);
display: flex;
flex-direction: column;
align-items: center;
gap: 1rem;
z-index: var(--z-modal);
padding: 32px;
white-space: normal;
box-shadow:
0px 4px 5px 0px rgba(0, 0, 0, 0.14),
0px 1px 10px 0px rgba(0, 0, 0, 0.12),
0px 2px 4px -1px rgba(0, 0, 0, 0.2);
scrollbar-width: none;
-ms-overflow-style: none;
}

.modal::-webkit-scrollbar {
display: none;
}

#back-button {
cursor: pointer;
}

.title {
display: flex;
align-items: center;
gap: 1rem;
width: 100%;
background-color: var(--surface-seven);
}

.title.hasIcon {
flex-direction: column;
}

.buttons {
display: flex;
gap: 2rem;
justify-content: flex-end;
width: 100%;
}

.modal.fullscreen {
padding: 0;
max-height: 100%;
width: 100%;
border-radius: 0;
}

.modal.fullscreen.scrolled .title {
border-bottom: 1px solid var(--border);
}

.modal.fullscreen .slot {
padding: 0 32px 32px;
}

.modal.fullscreen .title {
justify-content: flex-start;
position: sticky;
padding: 32px;
padding-bottom: 0.75rem;
top: 0;
left: 0;
}

button {
padding: 0;
margin: 0;
border: none;
background-color: transparent;
display: flex;
align-items: center;
}

.slot {
display: flex;
flex-direction: column;
align-content: center;
width: 100%;
}
</style>
