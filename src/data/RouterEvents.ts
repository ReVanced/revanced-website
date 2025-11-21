import { navigating, page } from '$app/stores';
import { derived, type Readable } from 'svelte/store';

export interface RouterEvent {
	// URL of the current page or the page we are navigating to.
	target_url: URL;
	// Are we navigating?
	navigating: boolean;
}

function makeStore(): Readable<RouterEvent> {
	// This stuff will run both client side and server side.

	if (typeof location === 'undefined') {
		// `location` does not exist on the server.
		// Return a derived store based on `page` for SSR.
		// Server will never navigate so this is fine.
		return derived(page, ($page) => {
			return { navigating: false, target_url: $page.url };
		});
	}

	// On client.
	let current = new URL(location.href);

	// Return store that responds to navigation events.
	// The `navigating` store immediately "pushes" `null`.
	// This in turn causes this derived store to immediately "push" the current URL.
	return derived(navigating, ($nav) => {
		let navigating = false;
		// $nav is null when navigation finishes.
		if ($nav != null && $nav.to != null) {
			current = $nav.to.url;
			navigating = true;
		}

		return { navigating, target_url: current };
	});
}

// Do not subscribe to it outside of components!
export default makeStore();
