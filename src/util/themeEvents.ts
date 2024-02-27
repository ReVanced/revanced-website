import { DateTriggerEvent } from 'datetrigger';

const applyCssVar = (name: string, value: string): void => {
	if (!name.startsWith('--')) return console.error("A CSS variable must start with '--'");
	document.documentElement.style.setProperty(name, value);
};

export const events: DateTriggerEvent[] = [];
