import { onMount } from 'svelte';

function setHue(hue: number) {
    document.documentElement.style.setProperty('--hue', hue.toString());
}

function calculateEaster(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
}

export function useHolidayTheme() {
    onMount(() => {
        const today = new Date();
        const year = today.getFullYear();
        const holidays = [
            { month: 0, day: 1, hue: 240 },
            { month: 11, day: 25, hue: 120 },
            { month: 1, day: 14, hue: 300 },
            { month: 9, day: 31, hue: 0 },
            { month: 3, day: 1, hue: 69 },
        ];
        const easter = calculateEaster(year);
        holidays.push({ month: easter.getMonth(), day: easter.getDate(), hue: 100 });

        for (const { month, day, hue } of holidays) {
            if (
                today.getMonth() === month &&
                today.getDate() === day &&
                today.getFullYear() === year
            ) {
                setHue(hue);
                break;
            }
        }
    });
}
