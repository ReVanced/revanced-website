<script lang="ts">
import Button from "$lib/components/Button.svelte";
import { queries } from "$data/api";
import { onMount } from "svelte";
import { createQuery } from "@tanstack/svelte-query";
import Query from "$lib/components/Query.svelte";
import Dialogue from "$lib/components/Dialogue.svelte";

const query = createQuery(["manager"], queries.manager);

let warning: string;
let warningDialogue = false;

let userAgent: string;
let isAndroid: boolean;
let androidVersionMatch: RegExpExecArray | null;
let androidVersion: number;
let managerUrl: string;

onMount(() => {
	userAgent = navigator.userAgent;
	androidVersionMatch = /Android\s([\d.]+)/i.exec(userAgent);
	androidVersion = androidVersionMatch ? parseInt(androidVersionMatch[1]) : 0;
	isAndroid = !!androidVersion;
});

query.subscribe((val) => {
	if (val.data) managerUrl = val.data.assets[0].browser_download_url;
});

function handleClick() {
	if (!isAndroid) {
		warning = "Your device is not running Android.";
		warningDialogue = true;
	} else if (androidVersion < 8) {
		warning = `Your device is running ${androidVersion}. ReVanced Manager only supports Android versions 8 and above.`;
		warningDialogue = true;
	}
}
</script>

<Dialogue bind:modalOpen={warningDialogue}>
	<svelte:fragment slot="title">Device unsupported</svelte:fragment>
	<svelte:fragment slot="description">{warning} Do you still want to download ReVanced Manager?</svelte:fragment>
	<svelte:fragment slot="buttons">
		<Button
			type="text"
			href={managerUrl}
			on:click={() => (warningDialogue = false)}>Download</Button
		>
		<Button type="text" on:click={() => (warningDialogue = false)}>Cancel</Button>
	</svelte:fragment>
</Dialogue>

<section class="hero">
	<div class="hero-text">
		<h1>Continuing the <br />legacy of <span>Vanced.</span></h1>
		<p>
			Customize your mobile experience through ReVanced <br /> by applying patches to your applications.
		</p>
		<div class="hero-buttons">
				<Button
					on:click={handleClick}
					type="filled"
					icon="download"
				>
					Download Manager
				</Button>
			<Button icon="docs" type="tonal" href="patches">View patches</Button>
		</div>
	</div>
</section>

<style>
	h1 {
		color: var(--white);
		margin-bottom: 1.5rem;
	}

	p {
		margin-bottom: 2rem;
	}

	.hero {
		padding-bottom: 9rem;
	}

	.hero-text {
		align-items: center;
	}

	.hero-buttons {
		display: flex;
		user-select: none;
		gap: 1rem;
	}

	span {
		color: var(--accent-color);
	}

	@media (max-width: 767px) {
		.hero {
			padding-bottom: 0;
		}

		br {
			content: ' ';
		}
	}

	@media screen and (max-width: 450px) {
		.hero-buttons {
			flex-direction: column;
		}
	}
</style>
