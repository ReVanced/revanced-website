import moment from 'moment';

export const fromNow = (timestamp: number) => moment(timestamp).fromNow(true);
