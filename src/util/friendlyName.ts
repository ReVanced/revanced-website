export function friendlyName(text: string): string {
	return text
		.replace(/-/g, ' ')
		.replace(/\brevanced\b/g, 'ReVanced')
		.replace(/\bcli\b/g, 'CLI')
		.replace(/api/g, 'API')
		.replace(/(?:^|\s)\S/g, (x: string) => x.toUpperCase());
}
