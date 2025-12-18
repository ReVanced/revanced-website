<script lang="ts">
import { page } from '$app/stores';
import Button from '$components/atoms/Button.svelte';

let status = $derived($page.status);
</script>

<svelte:head>
<title>{status} | ReVanced</title>
</svelte:head>

<section class="wrapper">
<h1>{status}</h1>
{#if status === 404}
<p>This page received a cease and desist letter from a multi-billion dollar tech company.</p>
<br />
<Button buttonStyle="filled" href="/">Return home</Button>
{:else}
<p>
{$page.error?.message}
</p>
{/if}
</section>

<style>
section {
display: flex;
flex-direction: column;
width: fit-content;
text-align: center;
margin-top: 10rem;
}

h1 {
color: var(--primary);
}
</style>
