export const debounce = <T extends unknown[]>(f: (...args: T) => void, delay = 350) => {
	let timeout: ReturnType<typeof setTimeout> | undefined;
	return (...args: T) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => f(...args), delay);
	};
};
