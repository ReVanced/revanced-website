import Fuse, { type IFuseOptions } from 'fuse.js';

export function createFilter<T, C = void>(
	fuseOptions: IFuseOptions<T>,
	additionalFilter?: (item: T, context: C) => boolean
) {
	let cachedItems: T[] | null = null;
	let cachedFuse: Fuse<T> | null = null;

	return (items: T[], search: string, context?: C): T[] => {
		if (cachedItems !== items) {
			cachedItems = items;
			cachedFuse = new Fuse(items, {
				threshold: 0.3,
				ignoreLocation: true,
				...fuseOptions
			});
		}

		let results: T[];

		if (!search || !search.trim()) {
			results = items;
		} else {
			results = cachedFuse!.search(search).map(({ item }) => item);
		}

		if (additionalFilter && context !== undefined) {
			results = results.filter((item) => additionalFilter(item, context));
		}

		return results;
	};
}

export default createFilter;
