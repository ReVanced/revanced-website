declare module 'qrious' {
	interface QRiousOptions {
		element?: HTMLCanvasElement;
		value?: string;
		size?: number;
		level?: 'L' | 'M' | 'Q' | 'H';
		background?: string;
		foreground?: string;
		padding?: number;
	}

	class QRious {
		constructor(options?: QRiousOptions);
		value: string;
		size: number;
		toDataURL(type?: string): string;
	}

	export default QRious;
}
