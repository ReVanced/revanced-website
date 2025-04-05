import moment, { type Moment } from 'moment';

type MonthName =
	| 'january'
	| 'february'
	| 'march'
	| 'april'
	| 'may'
	| 'june'
	| 'july'
	| 'august'
	| 'september'
	| 'october'
	| 'november'
	| 'december';

const getEaster = (): Moment => {
	const currentYear = new Date().getFullYear();

	const a = currentYear % 19,
		b = Math.floor(currentYear / 100),
		c = currentYear % 100,
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

	return moment(new Date(currentYear, month - 1, day));
};

export const themes = {
	newYear: ['january', 1],
	christmas: ['december', 25],
	valentine: ['february', 14],
	halloween: ['october', 31],
	easter: [getEaster().format('MMMM').toLowerCase() as MonthName, getEaster().date()],
	aprilFools: ['april', 1]
} as const satisfies Record<string, [month: MonthName, date: number]>;
