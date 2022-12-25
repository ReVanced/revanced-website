import { dev } from '$app/environment';
import { cubicOut } from 'svelte/easing';

// console.log, but only if in dev environment.
export function dev_log(part: string, ...args) {
	if (dev) {
		console.log(`[${part}]:`, ...args);
	}
}

export function friendlyName(text: string): string {
	return text
		.replace(/-/g, ' ')
		.replace(/revanced\/revanced/g, '')
		.replace(/revanced/g, 'ReVanced')
		.replace(/\bcli\b/g, 'CLI')
		.replace(/api/g, 'API')
		.replace(/microg/g, 'MicroG')
		.replace(/hdr/g, 'HDR')
		.replace(/sponsorblock/g, 'SponsorBlock')
		.replace(/tiktok/g, 'TikTok')
		.replace(/vr/g, 'VR')
		.replace(/(?:^|\s)\S/g, (x: string) => x.toUpperCase());
}

// stolen from https://svelte.dev/repl/6d5239f09b0b4dc6aafeb70606a0fe94?version=3.46.4
// please add this svelte thanks ily <3
export function horizontalSlide(
	node,
	{ delay = 0, duration = 400, easing = cubicOut, direction = 'block' } = {}
) {
	const style = getComputedStyle(node);
	const opacity = +style.opacity;
	const capitalized_logical_property = `${direction[0].toUpperCase()}${direction.slice(1)}`;
	const size_value = parseFloat(style[`${direction}Size`]);
	const padding_start_value = parseFloat(style[`padding${capitalized_logical_property}Start`]);
	const padding_end_value = parseFloat(style[`padding${capitalized_logical_property}End`]);
	const margin_start_value = parseFloat(style[`margin${capitalized_logical_property}Start`]);
	const margin_end_value = parseFloat(style[`margin${capitalized_logical_property}End`]);
	const border_width_start_value = parseFloat(
		style[`border${capitalized_logical_property}StartWidth`]
	);
	const border_width_end_value = parseFloat(style[`border${capitalized_logical_property}EndWidth`]);

	return {
		delay,
		duration,
		easing,
		css: (t) =>
			'overflow: hidden;' +
			`opacity: ${Math.min(t * 20, 1) * opacity};` +
			`${direction}-size: ${t * size_value}px;` +
			`padding-${direction}-start: ${t * padding_start_value}px;` +
			`padding-${direction}-end: ${t * padding_end_value}px;` +
			`margin-${direction}-start: ${t * margin_start_value}px;` +
			`margin-${direction}-end: ${t * margin_end_value}px;` +
			`border-${direction}-start-width: ${t * border_width_start_value}px;` +
			`border-${direction}-start-width: ${t * border_width_end_value}px;`
	};
}
