const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function relativeTime(dateStr: string, withinDays = 7) {
	const date = new Date(dateStr);
	const diffMs = Date.now() - date.getTime();
	const diffDays = Math.floor(diffMs / 864e5); // 1000*60*60*24

	if (diffDays <= withinDays) {
		const diffHours = Math.floor(diffMs / 36e5);
		const diffMins = Math.floor(diffMs / 6e4);

		if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
		if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
		if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
		return 'just now';
	}

	const h = date.getHours();
	const hour = h % 12 || 12;
	const mins = date.getMinutes().toString().padStart(2, '0');
	const ampm = h >= 12 ? 'PM' : 'AM';
	return `on ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} at ${hour}:${mins} ${ampm}`;
}
