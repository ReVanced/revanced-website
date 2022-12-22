import { list } from '$lib/blog';

export const load = async ({ fetch }) => {
	return { posts: await list(fetch) };
};
