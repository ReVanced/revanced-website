export const isValidUrl = (str: string) => {
	try { new URL(str); return true; } catch { return false; }
};

export const parseAttachmentUrls = (raw: string) =>
	raw.split('\n').map(l => l.trim()).filter(l => l && isValidUrl(l));
