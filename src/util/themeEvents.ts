import { DateTriggerEvent, DAY_IN_MINUTES } from 'datetrigger';

const changeHue = (n: number) => document.documentElement.style.setProperty('--hue', n.toString());

/**
 * Get the date of when easter should happen based off a given year
 * @param Y The year to get Easter's date from
 * @returns When Easter should happen
 */
function getEaster(Y: number): Date {
	const a = Y % 19,
		b = Math.floor(Y / 100),
		c = Y % 100,
		d = Math.floor(b / 4),
		e = b % 4,
		f = Math.floor((b + 8) / 25),
		g = Math.floor((b - f + 1) / 3),
		h = (19 * a + b - d - g + 15) % 30,
		i = Math.floor(c / 4),
		k = c % 4,
		L = (32 + 2 * e + 2 * i - h - k) % 7,
		m = Math.floor((a + 11 * h + 22 * L) / 451),
		month = Math.floor((h + L - 7 * m + 114) / 31),
		day = ((h + L - 7 * m + 114) % 31) + 1;
	return new Date(Y, month - 1, day);
}

const currentYear = new Date().getFullYear();

export const events: DateTriggerEvent[] = [
	// New Year.
	new DateTriggerEvent(new Date(currentYear, 0, 1), DAY_IN_MINUTES, () => {
		changeHue(240);
	}),
	// Christmas.
	new DateTriggerEvent(new Date(currentYear, 11, 25), DAY_IN_MINUTES, () => {
		changeHue(120);
	}),
	// Valentine's day.
	new DateTriggerEvent(new Date(currentYear, 1, 14), DAY_IN_MINUTES, () => {
		changeHue(300);
	}),
	// Halloween.
	new DateTriggerEvent(new Date(currentYear, 9, 31), DAY_IN_MINUTES, () => {
		changeHue(0);
	}),
	// Easter.
	new DateTriggerEvent(getEaster(currentYear), DAY_IN_MINUTES, () => {
		changeHue(100);
	}),
	// April Fools.
	new DateTriggerEvent(new Date(currentYear, 3, 1), DAY_IN_MINUTES, () => {
		changeHue(69);
	})
];
