export class DateTrigger {
	private today: Date;

	constructor() {
		this.today = new Date();
	}

	get trigger() {
		return {
			onNewYear: (year: number, callback: () => void) => {
				if (
					this.today.getFullYear() === year &&
					this.today.getMonth() === 0 &&
					this.today.getDate() === 1
				) {
					callback();
				}
			},
			onChristmas: (year: number, callback: () => void) => {
				if (
					this.today.getFullYear() === year &&
					this.today.getMonth() === 11 &&
					this.today.getDate() === 25
				) {
					callback();
				}
			},
			onEaster: (year: number, callback: () => void) => {
				const easter = this.getEasterDate(year);
				if (
					this.today.getFullYear() === year &&
					this.today.getMonth() === easter.getMonth() &&
					this.today.getDate() === easter.getDate()
				) {
					callback();
				}
			},
			when: (predicate: (d: Date) => boolean, callback: () => void) => {
				if (predicate(this.today)) {
					callback();
				}
			}
		};
	}

	private getEasterDate(year: number): Date {
		const G = year % 19;
		const C = Math.floor(year / 100);
		const H = (C - Math.floor(C / 4) - Math.floor((8 * C + 13) / 25) + 19 * G + 15) % 30;
		const I = H - Math.floor(H / 28) * (1 - Math.floor(29 / (H + 1)) * Math.floor((21 - G) / 11));
		const J = (year + Math.floor(year / 4) + I + 2 - C + Math.floor(C / 4)) % 7;
		const L = I - J;
		const month = 3 + Math.floor((L + 40) / 44);
		const day = L + 28 - 31 * Math.floor(month / 4);

		return new Date(year, month - 1, day);
	}
}
