import { get_one } from '$lib/blog';
import { parse } from 'marked';

export const load = async ({ fetch, params }) => {
	let post = await get_one(params.slug, fetch);
	post.content = parse(post.content);
	return { post };
};
