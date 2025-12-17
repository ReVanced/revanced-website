export const debounce = <T extends any[]>(fn: (...args: T) => void, delay = 350) => {
	let timeout: ReturnType<typeof setTimeout>;
	return (...args: T) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), delay);
	};
};
