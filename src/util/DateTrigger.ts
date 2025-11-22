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
		const f = Math.floor;
		const G = year % 19;
		const C = f(year / 100);
		const H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30;
		const I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11));
		const J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7;
		const L = I - J;
		const month = 3 + f((L + 40) / 44);
		const day = L + 28 - 31 * f(month / 4);

		return new Date(year, month - 1, day);
	}
}
