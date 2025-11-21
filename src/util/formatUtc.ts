// TODO: Replace moment.js with a modern alternative like date-fns or dayjs
// Moment.js is deprecated and adds ~70KB to the bundle size
// Modern alternatives are smaller, tree-shakeable, and actively maintained
import moment from 'moment';

export const formatUTC = (d: string | number | Date | null | undefined): string | null => {
	if (!d) return null;

	const momentDate = moment(d);
	if (!momentDate.isValid()) {
		console.warn('Invalid date provided to formatUTC:', d);
		return null;
	}

	return momentDate.utc().format('YYYY-MM-DDTHH:mm[Z]');
};
