import moment from 'moment';

export const formatUTC = (d: any) => d && moment(d).utc().format('YYYY-MM-DDTHH:mm[Z]');
