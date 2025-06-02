import Fuse from 'fuse.js';

type SearcherOptions<T> = {
	keys: string[];
	shouldSort?: boolean;
	threshold?: number;
};

type FilterOptions<T, C> = {
	searcherOptions: SearcherOptions<T>;
	additionalFilter?: (item: T, context: C) => boolean;
};

function createFilter<T, C>(items: T[], options: FilterOptions<T, C>) {
	const { searcherOptions, additionalFilter } = options;

	const searcher = new Fuse(items, {
		keys: searcherOptions.keys,
		shouldSort: searcherOptions.shouldSort ?? true,
		threshold: searcherOptions.threshold ?? 0.3
	});

	return (context: C, search?: string): T[] => {
		if (!search) {
			return additionalFilter ? items.filter((item) => additionalFilter(item, context)) : items;
		}

		const results = searcher.search(search).map(({ item }) => item);

		return additionalFilter ? results.filter((item) => additionalFilter(item, context)) : results;
	};
}

export default createFilter;
