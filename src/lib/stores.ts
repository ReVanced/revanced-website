import { readable } from 'svelte/store';
import moment from 'moment';
import { events } from './events';
import { seconds } from './time';

export const event = readable('default', (set) => {
	const updateTheme = () => {
		const now = moment();

		const today = {
			month: now.format('MMMM').toLowerCase(),
			date: now.date()
		};

		Object.entries(events).forEach(([eventName, [month, date]]) => {
			if (today.month === month && today.date === date) set(eventName);
		});
	};

	updateTheme();
	const interval = setInterval(updateTheme, seconds(30));

	return () => clearInterval(interval);
});
