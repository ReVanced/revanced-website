import { error } from '@sveltejs/kit';

const url = 'http://localhost:1337';

export async function list(fetch_fn = fetch) {
	// TODO: only get the fields we need.
	const res = await fetch_fn(`${url}/api/posts?populate=*`);
	const data = await res.json();

	return data.data;
}

export async function get_one(slug: string, fetch_fn = fetch) {
	const res = await fetch_fn(`${url}/api/posts?filters[slug][$eq]=${slug}`);
	if (res.status === 404) {
		throw error(404, `The post with slug ${slug} was not found`);
	} else {
		const response = await res.json();
		return response.data[0].attributes;
	}
}
