export const prerender = true;

// https://kit.svelte.dev/docs/load#layout-data
// https://kit.svelte.dev/docs/load#making-fetch-requests
export async function load({ fetch }) {
	return {
		ping: await fetch('https://api.revanced.app/v3/ping', { method: 'HEAD' })
	};
}
