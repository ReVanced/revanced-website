export const applyCssVar = (name: string, value: string): void => {
	document.documentElement.style.setProperty(name, value);
};
