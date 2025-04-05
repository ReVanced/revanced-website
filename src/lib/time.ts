export const seconds = (seconds: number): number => seconds * 1000;
export const minutes = (minutes: number): number => seconds(minutes * 60);
export const hours = (hours: number): number => minutes(hours * 60);
export const days = (days: number): number => hours(days * 24);
