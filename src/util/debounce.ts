export const debounce = <T extends any[]>(
	f: (...args: T) => void,
	delay: number = 350
): ((...args: T) => void) & { cancel: () => void } => {
	let timeout: ReturnType<typeof setTimeout> | null = null;

	const debounced = (...args: T) => {
		if (timeout !== null) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(() => {
			timeout = null;
			f(...args);
		}, delay);
	};

	// Add cleanup method
	debounced.cancel = () => {
		if (timeout !== null) {
			clearTimeout(timeout);
			timeout = null;
		}
	};

	return debounced;
};
