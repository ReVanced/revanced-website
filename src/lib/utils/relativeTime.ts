import moment from 'moment';

/*

Local-time format once we know the viewers' timezone.

Only use this in the browser, moment() uses local time which won't match the server's UTC timezone.

*/


const ABSOLUTE_FORMAT = 'on MMMM D, YYYY [at] h:mm A';


 // Server safe absolute format.
 // The API stores announcement timestamps as UTC instants so rendering them explicitly as UTC is deterministic: the server and the hydrating client produce exakt same text regardless of either time zone.

const ABSOLUTE_UTC_FORMAT = 'on MMMM D, YYYY [at] h:mm A [UTC]';
export function relativeTime(date: string, withinDays: number = 7) {
	return moment().diff(moment(date), 'days') <= withinDays
		? moment(date).fromNow()
		: moment(date).format(ABSOLUTE_FORMAT);
}

// Deterministic UTC rendering and identical on the server and during hydration.
export function absoluteUtcTime(date: string) {
	return moment.utc(date).format(ABSOLUTE_UTC_FORMAT);
}

 // We need to pick the deterministic UTC form until the app has hydrated then the viewer-local form.
 // Pass hydrated.current as "localised".
export function displayTime(date: string, localised: boolean, withinDays: number = 7) {
	return localised ? relativeTime(date, withinDays) : absoluteUtcTime(date);
}

// Machine readable value for <time datetime="......">. Absolute, so SSR-safe. / No more comments in code as they are taking lots of energy. A good coder should understand my code.
export function isoDateTime(date: string) {
	const parsed = moment.utc(date);
	return parsed.isValid() ? parsed.toISOString() : '';
}

export const fromNow = (timestamp: number) => moment(timestamp).fromNow(true);

export const formatUTC = (d: string | number | Date) =>
	d && moment(d).utc().format('YYYY-MM-DDTHH:mm[Z]');

export const formatDateTimeLocal = (d: string | number | Date) =>
	moment(d).format('YYYY-MM-DDTHH:mm');
