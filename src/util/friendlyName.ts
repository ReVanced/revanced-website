export function friendlyName(text: string): string {
	return text
		.replace(/-/g, ' ')
		.replace(/revanced\/revanced/g, '')
		.replace(/revanced/g, 'ReVanced')
		.replace(/\bcli\b/g, 'CLI')
		.replace(/api/g, 'API')
		.replace(/microg/g, 'MicroG')
		.replace(/hdr/g, 'HDR')
		.replace(/sponsorblock/g, 'SponsorBlock')
		.replace(/tiktok/g, 'TikTok')
		.replace(/vr/g, 'VR')
		.replace(/(?:^|\s)\S/g, (x: string) => x.toUpperCase());
}