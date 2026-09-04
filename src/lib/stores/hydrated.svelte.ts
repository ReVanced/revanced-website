/*

Keep track of whether the app has finished hydrating in the browser.

$app/environment's "browser" is already true during hydration so it cant really be used for things that need to match the server's first render. 

This stays false on the server and during the initial client render then flips once markHydrated() is called from the root layout's onMount.

Use this for stuff thats genuinely viewer-specific (local timezone, per-visitor ordering, etc......).
Render the same deterministic value as SSR first then enhance it once this becomes true.

Module-level state is usually a no go on the server since it is shared between requests. 
This is fine here because we never write to it on the server, onMount doesnt run there, so every request starts with "false".


*/

let value = $state(false);

export const hydrated = {
	get current() {
		return value;
	},
	markHydrated() {
		value = true;
	}
};
