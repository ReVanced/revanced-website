<script lang="ts">
	import { queries } from '$data/api';
	import { dev_log } from '$util/dev';

	import RouterEvents from '$data/RouterEvents';
	import { useQueryClient } from '@tanstack/svelte-query';
	const client = useQueryClient();

	export let href: string;
	export let queryKey: null | keyof typeof queries | Array<keyof typeof queries> = null;

	function prefetch() {
		if (queryKey !== null) {
			if (Array.isArray(queryKey)) {
				queryKey.forEach((key) => {
					const query = (queries[key] as Function)();
					dev_log('Prefetching', query);
					client.prefetchQuery(query as any);
				});
			} else {
				const query = queries[queryKey];
				dev_log('Prefetching', query);
				client.prefetchQuery(query as any);
			}
		}
	}
</script>

<a data-sveltekit-preload-data on:mouseenter={prefetch} {href}>
	<!-- Check if href is equal to the first path -->
	<li class:selected={href === '/' + $RouterEvents.target_url.pathname.split('/')[1]}>
		<span><slot /></span>
	</li>
</a>

<style>
	li {
		border: var(--grey-six);
		text-align: center;
		list-style: none;
		position: relative;
		font-weight: 500;
		font-size: 1rem;
		align-items: center;
		border: var(--grey-six);
		transition-timing-function: var(--bezier-one);
		transition-duration: 0.25s;
		padding: 10px 16px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	a {
		text-decoration: none;
		font-size: 1rem;
		user-select: none;
		border-radius: 10px;
	}

	span {
		font-weight: 400;
		font-size: 0.9rem;
		letter-spacing: 0.02rem;
		color: var(--grey-five);
	}

	li:hover {
		color: var(--white);
		background-color: var(--grey-one);
	}

	li.selected {
		background-color: var(--accent-low-opacity);
		color: var(--accent-color);
	}

	li.selected span {
		color: var(--accent-color);
	}

	@media (max-width: 767px) {
		li {
			padding: 0.75rem 1.25rem;
			text-align: left;
			justify-content: left;
			border-radius: 100px;
		}

		span {
			font-size: 1rem;
			font-weight: 500;
		}
	}
</style>
