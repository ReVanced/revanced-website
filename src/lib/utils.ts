import { dev } from "$app/environment";

// console.log, but only if in dev environment.
export function dev_log(part: string, ...args) {
  if (dev) {
    console.log(`[${part}]:`, ...args);
  }
}

// Use directive that makes an element dispatch an event when you click or tap outside of it.
// Stolen from the svelte docs: https://svelte.dev/tutorial/actions
export function click_outside(node: Element) {
  const handle = (event: MouseEvent) => {
    if (!node.contains(event.target)) {
      node.dispatchEvent(new CustomEvent("click_outside"));
    }
  };

  document.addEventListener("touchstart", handle, true);
  document.addEventListener("click", handle, true);

  return {
    destroy() {
      document.removeEventListener("touchstart", handle, true);
      document.removeEventListener("click", handle, true);
    },
  };
}
