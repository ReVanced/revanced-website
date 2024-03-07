export function timeAgo(date: string): string {
	const now = new Date();
	const timestamp = new Date(date);
	const timeDifference = now.getTime() - timestamp.getTime();
	const seconds = Math.floor(timeDifference / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const months = Math.floor(days / 30.44); // An average month has about 30.44 days
	const years = Math.floor(months / 12);

	if (years > 0) {
		return years + (years === 1 ? ' year ago' : ' years ago');
	} else if (months > 0) {
		return months + (months === 1 ? ' month ago' : ' months ago');
	} else if (days > 0) {
		return days + (days === 1 ? ' day ago' : ' days ago');
	} else if (hours > 0) {
		return hours + (hours === 1 ? ' hour ago' : ' hours ago');
	} else if (minutes > 0) {
		return minutes + (minutes === 1 ? ' minute ago' : ' minutes ago');
	} else {
		return seconds + (seconds === 1 ? ' second ago' : ' seconds ago');
	}
}
