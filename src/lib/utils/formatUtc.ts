const toDate = (d: string | Date) => typeof d === 'string' ? new Date(d) : d;

export function formatUtc(dateString: string | Date, options: Intl.DateTimeFormatOptions = {}) {
	const date = toDate(dateString);
	if (isNaN(date.getTime())) return 'Invalid date';

	return date.toLocaleDateString(undefined, {
		year: 'numeric', month: 'long', day: 'numeric',
		hour: '2-digit', minute: '2-digit',
		...options
	});
}

export const formatShortDate = (d: string | Date) =>
	formatUtc(d, { year: 'numeric', month: 'short', day: 'numeric' });

export function formatIsoDate(d: string | Date) {
	const date = toDate(d);
	return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
}

export function formatRelative(d: string | Date) {
	const date = toDate(d);
	if (isNaN(date.getTime())) return 'Invalid date';

	const diff = date.getTime() - Date.now();
	const abs = Math.abs(diff);
	const secs = Math.floor(abs / 1000);
	const mins = Math.floor(secs / 60);
	const hrs = Math.floor(mins / 60);
	const days = Math.floor(hrs / 24);

	const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
	const sign = diff > 0 ? 1 : -1;

	if (secs < 60) return rtf.format(sign * secs, 'second');
	if (mins < 60) return rtf.format(sign * mins, 'minute');
	if (hrs < 24) return rtf.format(sign * hrs, 'hour');
	if (days < 30) return rtf.format(sign * days, 'day');
	return formatShortDate(date);
}
