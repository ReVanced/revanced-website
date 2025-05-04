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

// prettier-ignore
const getEaster = (): Moment => {
	const currentYear = new Date().getFullYear();
	const yearMod19 = currentYear % 19;
	const century = Math.floor(currentYear / 100);
	const yearInCentury = currentYear % 100;
	const centuryQuotient = Math.floor(century / 4);
	const centuryRemainder = century % 4;
	const specialCenturyTerm = Math.floor((century + 8) / 25);
	const specialCenturyCorrection = Math.floor((century - specialCenturyTerm + 1) / 3);
	const lunarCorrection = (19 * yearMod19 + century - centuryQuotient - specialCenturyCorrection + 15) % 30;
	const yearQuotient = Math.floor(yearInCentury / 4);
	const yearRemainder = yearInCentury % 4;
	const dayOfWeekCorrection = (32 + 2 * centuryRemainder + 2 * yearQuotient - lunarCorrection - yearRemainder) % 7;
	const specialLunarCorrection = Math.floor((yearMod19 + 11 * lunarCorrection + 22 * dayOfWeekCorrection) / 451);
	const easterMonth = Math.floor((lunarCorrection + dayOfWeekCorrection - 7 * specialLunarCorrection + 114) / 31);
	const easterDay = ((lunarCorrection + dayOfWeekCorrection - 7 * specialLunarCorrection + 114) % 31) + 1;

	return moment(new Date(currentYear, easterMonth - 1, easterDay));
};

export const events = {
	newYear: ['january', 1],
	christmas: ['december', 25],
	valentine: ['february', 14],
	halloween: ['october', 31],
	easter: [
		getEaster().format('MMMM').toLowerCase() as MonthName, // can be 'march' or 'april'
		getEaster().date() // variable date
	],
	aprilFools: ['april', 1]
} as const satisfies Record<string, [month: MonthName, date: number]>;
