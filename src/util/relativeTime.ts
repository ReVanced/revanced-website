import moment from 'moment';

export const relativeTime = (date: string, withinDays: number = 7) => {
	return moment().diff(moment(date), 'days') <= withinDays
		? moment(date).fromNow()
		: moment(date).format('on MMMM D, YYYY [at] h:mm A');
};
