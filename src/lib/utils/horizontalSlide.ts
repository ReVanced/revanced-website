import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

type Params = { delay?: number; duration?: number; easing?: (t: number) => number };

export function horizontalSlide(node: HTMLElement, { delay = 0, duration = 400, easing = cubicOut }: Params = {}): TransitionConfig {
	const s = getComputedStyle(node);
	const o = +s.opacity, w = +s.width;
	const pl = +s.paddingLeft, pr = +s.paddingRight;
	const ml = +s.marginLeft, mr = +s.marginRight;
	const bl = +s.borderLeftWidth, br = +s.borderRightWidth;

	return {
		delay, duration, easing,
		css: (t) => `overflow:hidden;opacity:${Math.min(t * 20, 1) * o};width:${t * w}px;padding-left:${t * pl}px;padding-right:${t * pr}px;margin-left:${t * ml}px;margin-right:${t * mr}px;border-left-width:${t * bl}px;border-right-width:${t * br}px`
	};
}
