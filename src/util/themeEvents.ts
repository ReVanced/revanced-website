import type { DateTrigger } from './DateTrigger';

const changeHue = (n: number) => document.documentElement.style.setProperty('--hue', n.toString());

export const registerThemeEvents = (dt: DateTrigger) => {
	const currentYear = new Date().getFullYear();
	const t = dt.trigger;

	// New Year.
	t.onNewYear(currentYear, () => {
		changeHue(240);
	});
	// Christmas.
	t.onChristmas(currentYear, () => {
		changeHue(120);
	});
	// Valentine's day.
	t.when((d) => d.getMonth() === 1 && d.getDate() === 14, () => {
		changeHue(300);
	});
	// Halloween.
	t.when((d) => d.getMonth() === 9 && d.getDate() === 31, () => {
		changeHue(0);
	});
	// Easter.
	t.onEaster(currentYear, () => {
		changeHue(100);
	});
	// April Fools.
	t.when((d) => d.getMonth() === 3 && d.getDate() === 1, () => {
		changeHue(69);
	});
};
