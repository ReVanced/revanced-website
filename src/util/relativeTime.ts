import moment from 'moment';

export const relativeTime = (date: string) => {
	return moment().diff(moment(date), 'days') <= 7
		? moment(date).fromNow()
		: moment(date).format('on MMMM D, YYYY [at] h:mm A');
};
