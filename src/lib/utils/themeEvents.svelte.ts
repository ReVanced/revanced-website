import { browser } from '$app/environment';

const setHue = (hue: number) => document.documentElement.style.setProperty('--hue', String(hue));

// comptus algorithm
function getEaster(Y: number) {
	const a = Y % 19, b = Math.floor(Y / 100), c = Y % 100;
	const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
	const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
	const i = Math.floor(c / 4), k = c % 4;
	const L = (32 + 2 * e + 2 * i - h - k) % 7;
	const m = Math.floor((a + 11 * h + 22 * L) / 451);
	const month = Math.floor((h + L - 7 * m + 114) / 31);
	const day = ((h + L - 7 * m + 114) % 31) + 1;
	return new Date(Y, month - 1, day);
}

function checkAndApplyHolidayTheme() {
	const today = new Date();
	const y = today.getFullYear(), m = today.getMonth(), d = today.getDate();
	const easter = getEaster(y);
	
	const holidays: [number, number, number][] = [
		[0, 1, 240],
		[11, 25, 120],
		[1, 14, 300],
		[9, 31, 0],
		[3, 1, 69],
		[easter.getMonth(), easter.getDate(), 100]
	];

	for (const [hm, hd, hue] of holidays) {
		if (m === hm && d === hd) {
			setHue(hue);
			return;
		}
	}
}

function getMsUntilMidnight(): number {
	const now = new Date();
	const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
	return midnight.getTime() - now.getTime();
}

export function useHolidayTheme() {
	$effect(() => {
		if (!browser) return;
		
		checkAndApplyHolidayTheme();

		let midnightTimeout: ReturnType<typeof setTimeout>;
		let dailyInterval: ReturnType<typeof setInterval>;

		midnightTimeout = setTimeout(() => {
			checkAndApplyHolidayTheme();
			dailyInterval = setInterval(checkAndApplyHolidayTheme, 24 * 60 * 60 * 1000);
		}, getMsUntilMidnight());

		return () => {
			clearTimeout(midnightTimeout);
			if (dailyInterval) clearInterval(dailyInterval);
		};
	});
}
