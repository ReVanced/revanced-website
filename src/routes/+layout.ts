export const prerender = true;

// https://kit.svelte.dev/docs/load#layout-data
export async function load() {
	return {
		ping: await fetch('https://api.revanced.app/v3/ping', { method: 'HEAD' }),
		online_announcement: await (
			await fetch('https://api.revanced.app/v2/announcements/latest')
		).json()
	};
}
