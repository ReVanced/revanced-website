<script lang="ts">
	import { queries } from '$data/api';
	import { dev_log } from '$util/dev';

	import RouterEvents from '$data/RouterEvents';
	import { useQueryClient } from '@tanstack/svelte-query';
	const client = useQueryClient();

	export let href: string;
	export let queryKey: null | keyof typeof queries | Array<keyof typeof queries> = null;
	export let label: string;

	function prefetch() {
		if (queryKey !== null) {
			if (Array.isArray(queryKey)) {
				queryKey.forEach((key) => {
					const query = queries[key];
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

<li class:selected={href === '/' + $RouterEvents.target_url.pathname.split('/')[1]}>
	<a data-sveltekit-preload-data on:mouseenter={prefetch} {href} aria-label={label}>
		<!-- Check if href is equal to the first path -->
		<span><slot /></span>
	</a>
</li>

<style>
	li {
		list-style: none;
		position: relative;
		transition-timing-function: var(--bezier-one);
		transition-duration: 0.25s;
		border-radius: 10px;
	}

	a {
		text-decoration: none;
		user-select: none;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10px 16px;
	}

	span {
		font-weight: 400;
		font-size: 0.9rem;
		letter-spacing: 0.02rem;
		color: var(--text-four);
	}

	li:hover {
		color: var(--text-one);
		background-color: var(--surface-three);
	}

	li.selected {
		background-color: var(--tertiary);
		color: var(--primary);
		pointer-events: none;
	}

	li.selected span {
		color: var(--primary);
	}

	@media (max-width: 767px) {
		li {
			border-radius: 100px;
		}
		a {
			padding: 0.75rem 1.25rem;
			justify-content: left;
		}
		span {
			font-size: 1rem;
			font-weight: 500;
		}
	}
</style>
