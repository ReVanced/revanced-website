import { readable } from 'svelte/store';
import moment from 'moment';
import { events } from './events';
import { seconds } from './time';

export const theme = readable('default', (set) => {
	const updateTheme = () => {
		const today = moment();
		const monthName = today.format('MMMM').toLowerCase();
		const day = today.date();

		Object.entries(events).forEach(([eventName, [month, date]]) => {
			if (monthName === month && day === date) set(eventName);
		});
	};

	updateTheme();
	const interval = setInterval(updateTheme, seconds(30));

	return () => clearInterval(interval);
});
