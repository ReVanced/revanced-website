import { onMount } from 'svelte';

export interface UseIntersectionObserverOptions {
	root?: Element | null;
	rootMargin?: string;
	threshold?: number | number[];
	once?: boolean;
}

export interface UseIntersectionObserverReturn {
	readonly isIntersecting: boolean;
	readonly ratio: number;
	observe: (node: Element) => { destroy: () => void };
}

export function useIntersectionObserver(
	options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
	const { root = null, rootMargin = '0px', threshold = 0, once = false } = options;

	let isIntersecting = $state(false);
	let ratio = $state(0);
	let observer: IntersectionObserver | null = null;
	let observedElement: Element | null = null;

	function cleanup() {
		if (observer && observedElement) {
			observer.unobserve(observedElement);
		}
		if (observer) {
			observer.disconnect();
			observer = null;
		}
		observedElement = null;
	}

	function observe(node: Element) {
		if (typeof IntersectionObserver === 'undefined') {
			isIntersecting = true;
			ratio = 1;
			return { destroy: () => {} };
		}

		observedElement = node;

		observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				isIntersecting = entry.isIntersecting;
				ratio = entry.intersectionRatio;

				if (once && entry.isIntersecting) {
					cleanup();
				}
			},
			{ root, rootMargin, threshold }
		);

		observer.observe(node);

		return {
			destroy() {
				cleanup();
			}
		};
	}

	return {
		get isIntersecting() {
			return isIntersecting;
		},
		get ratio() {
			return ratio;
		},
		observe
	};
}
export function inView(
	node: Element,
	options: {
		class?: string;
		threshold?: number;
		rootMargin?: string;
		once?: boolean;
		onEnter?: () => void;
		onLeave?: () => void;
	} = {}
) {
	const {
		class: className = 'in-view',
		threshold = 0,
		rootMargin = '0px',
		once = false,
		onEnter,
		onLeave
	} = options;

	if (typeof IntersectionObserver === 'undefined') {
		node.classList.add(className);
		onEnter?.();
		return { destroy: () => {} };
	}

	const observer = new IntersectionObserver(
		(entries) => {
			const entry = entries[0];
			if (entry.isIntersecting) {
				node.classList.add(className);
				onEnter?.();
				if (once) {
					observer.disconnect();
				}
			} else {
				node.classList.remove(className);
				onLeave?.();
			}
		},
		{ threshold, rootMargin }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
export function createLazyLoader(options: UseIntersectionObserverOptions = {}) {
	const { rootMargin = '100px 0px', threshold = 0 } = options;
	
	const loadedItems = $state(new Set<string>());

	function lazyLoad(node: Element, id: string) {
		if (typeof IntersectionObserver === 'undefined') {
			loadedItems.add(id);
			return { destroy: () => {} };
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					loadedItems.add(id);
					observer.disconnect();
				}
			},
			{ rootMargin, threshold }
		);

		observer.observe(node);

		return {
			destroy() {
				observer.disconnect();
			}
		};
	}

	return {
		isLoaded: (id: string) => loadedItems.has(id),
		lazyLoad
	};
}
