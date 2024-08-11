import { DateTriggerEvent, DAY_IN_MINUTES } from 'datetrigger';

const applyCssVar = document.documentElement.style.setProperty;

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
	// new year
	new DateTriggerEvent(new Date(currentYear, 0, 1), DAY_IN_MINUTES, () => {
		applyCssVar('--hue', '240');
	}),
	// christmas
	new DateTriggerEvent(new Date(currentYear, 11, 25), DAY_IN_MINUTES, () => {
		applyCssVar('--hue', '120');
	}),
	// valentine's day
	new DateTriggerEvent(new Date(currentYear, 1, 14), DAY_IN_MINUTES, () => {
		applyCssVar('--hue', '300');
	}),
	// halloween
	new DateTriggerEvent(new Date(currentYear, 9, 31), DAY_IN_MINUTES, () => {
		applyCssVar('--hue', '0');
	}),
	// easter
	new DateTriggerEvent(getEaster(currentYear), DAY_IN_MINUTES, () => {
		applyCssVar('--hue', '100');
	}),
	// april fools
	new DateTriggerEvent(new Date(currentYear, 3, 1), DAY_IN_MINUTES, () => {
		applyCssVar('--hue', '69');
		applyCssVar('--main-font', '"Comic Sans MS", "Comic Sans", cursive');
	})
];
