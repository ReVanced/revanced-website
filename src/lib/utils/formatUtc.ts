export const formatUTC = (d: string | number | Date) => {
	if (!d) return undefined;
	const date = new Date(d);
	// Format: YYYY-MM-DDTHH:mmZ
	return date.toISOString().substring(0, 16) + 'Z';
};
