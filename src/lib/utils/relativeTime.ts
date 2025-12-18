import moment from 'moment';

export function relativeTime(date: string, withinDays: number = 7) {
	return moment().diff(moment(date), 'days') <= withinDays
		? moment(date).fromNow()
		: moment(date).format('on MMMM D, YYYY [at] h:mm A');
}

export const fromNow = (timestamp: number) => moment(timestamp).fromNow(true);

export const formatUTC = (d: string | number | Date) =>
	d && moment(d).utc().format('YYYY-MM-DDTHH:mm[Z]');
