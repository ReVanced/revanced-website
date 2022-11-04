import fs from 'fs';

// This code was stolen from https://github.com/sveltejs/kit/blob/master/packages/adapter-static/platforms.js

// sveltekit does things like this instead of actually just using ts for some reason.
/** @param {import('@sveltejs/kit').Builder} builder */
function vercel_routes(builder) {
	/** @type {any[]} */
	const routes = [
		{
			src: `/${builder.config.kit.appDir}/immutable/.+`,
			headers: {
				'cache-control': 'public, immutable, max-age=31536000'
			}
		}
	];

	// explicit redirects
	for (const [src, redirect] of builder.prerendered.redirects) {
		routes.push({
			src,
			headers: {
				Location: redirect.location
			},
			status: redirect.status
		});
	}

	// prerendered pages
	for (const [src, page] of builder.prerendered.pages) {
		routes.push({
			src,
			dest: `${builder.config.kit.appDir}/prerendered/${page.file}`
		});
	}

	// implicit redirects (trailing slashes)
	for (const [src] of builder.prerendered.pages) {
		if (src !== '/') {
			routes.push({
				src: src.endsWith('/') ? src.slice(0, -1) : src + '/',
				headers: {
					location: src
				},
				status: 308
			});
		}
	}

	routes.push({
		handle: 'filesystem'
	});

	return routes;
}

export function wrap(adapter, opts) {
	if (!process.env.VERCEL) {
		// we don't have to bother :)
		return adapter(opts);
	}

	// Not exactly what adapter-static does, but it works.
	opts.pages = '.vercel/output/static';

	adapter = adapter(opts);

	const adapt_fn = adapter.adapt;
	adapter.adapt = async (builder) => {
		const result = await adapt_fn(builder);
		fs.writeFileSync(
			'.vercel/output/config.json',
			JSON.stringify({
				version: 3,
				routes: vercel_routes(builder)
			})
		);
		return result;
	}

	return adapter;
}
