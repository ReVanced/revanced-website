export const debounce = <T extends any[]>(f: (...args: T) => void) => {
	let timeout: ReturnType<typeof setTimeout> | undefined;
	return (...args: T) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => f(...args), 350);
	};
};
