import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

type Direction = 'block' | 'inline';
type EasingFunction = (t: number) => number;

interface SlideOptions {
	delay?: number;
	duration?: number;
	easing?: EasingFunction;
	direction?: Direction;
}

interface StyleMetrics {
	opacity: number;
	size: number;
	padding: { start: number; end: number };
	margin: { start: number; end: number };
	border: { start: number; end: number };
}

const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

const extractStyleValue = (styles: CSSStyleDeclaration, property: string): number => {
	return parseFloat((styles as any)[property]) || 0;
};

const computeMetrics = (element: Element, axis: Direction): StyleMetrics => {
	const styles = getComputedStyle(element);
	const prop = capitalize(axis);

	return {
		opacity: Number(styles.opacity),
		size: extractStyleValue(styles, `${axis}Size`),
		padding: {
			start: extractStyleValue(styles, `padding${prop}Start`),
			end: extractStyleValue(styles, `padding${prop}End`)
		},
		margin: {
			start: extractStyleValue(styles, `margin${prop}Start`),
			end: extractStyleValue(styles, `margin${prop}End`)
		},
		border: {
			start: extractStyleValue(styles, `border${prop}StartWidth`),
			end: extractStyleValue(styles, `border${prop}EndWidth`)
		}
	};
};

const buildTransitionStyles = (
	progress: number,
	metrics: StyleMetrics,
	axis: Direction
): string => {
	const opacityValue = Math.min(progress * 20, 1) * metrics.opacity;

	const properties = [
		'overflow: hidden',
		`opacity: ${opacityValue}`,
		`${axis}-size: ${progress * metrics.size}px`,
		`padding-${axis}-start: ${progress * metrics.padding.start}px`,
		`padding-${axis}-end: ${progress * metrics.padding.end}px`,
		`margin-${axis}-start: ${progress * metrics.margin.start}px`,
		`margin-${axis}-end: ${progress * metrics.margin.end}px`,
		`border-${axis}-start-width: ${progress * metrics.border.start}px`,
		`border-${axis}-end-width: ${progress * metrics.border.end}px`
	];

	return properties.join('; ') + ';';
};

export function horizontalSlide(
	node: Element,
	options: SlideOptions = {}
): TransitionConfig {
	const { delay = 0, duration = 400, easing = cubicOut, direction = 'block' } = options;

	const metrics = computeMetrics(node, direction);

	return {
		delay,
		duration,
		easing,
		css: (t: number) => buildTransitionStyles(t, metrics, direction)
	};
}
