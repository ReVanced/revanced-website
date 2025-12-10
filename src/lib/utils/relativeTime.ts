export function relativeTime(dateStr: string, withinDays: number = 7): string {
	const date = new Date(dateStr);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays <= withinDays) {
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffMinutes = Math.floor(diffMs / (1000 * 60));

		if (diffDays > 0) {
			return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
		} else if (diffHours > 0) {
			return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
		} else if (diffMinutes > 0) {
			return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
		} else {
			return 'just now';
		}
	} else {
		const months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		];
		const month = months[date.getMonth()];
		const day = date.getDate();
		const year = date.getFullYear();
		let hours = date.getHours();
		const minutes = date.getMinutes();
		const ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12 || 12;
		const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

		return `on ${month} ${day}, ${year} at ${hours}:${minutesStr} ${ampm}`;
	}
}
