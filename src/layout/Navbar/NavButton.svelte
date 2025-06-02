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
					const query = (queries[key] as Function)();
					dev_log('Prefetching', query);
					client.prefetchQuery(query as any);
				});
			} else {
				const query = (queries[queryKey] as Function)();
				dev_log('Prefetching', query);
				client.prefetchQuery(query as any);
			}
		}
	}
</script>

<li
	class:selected={href === '/' + $RouterEvents.target_url.pathname.split('/')[1]}
	class:unclickable={$RouterEvents.target_url.pathname === href}
>
	<a data-sveltekit-preload-data on:mouseenter={prefetch} {href} aria-label={label}>
		<span><slot /></span>
	</a>
</li>

<style lang="scss">
	li {
		list-style: none;
		position: relative;
		transition-timing-function: var(--bezier-one);
		transition-duration: 0.25s;
		border-radius: 10px;

		&.selected {
			background-color: var(--tertiary);
			color: var(--primary);

			span {
				color: var(--primary);
			}
		}

		&.unclickable {
			pointer-events: none;
		}

		:hover {
			color: var(--text-one);
			background-color: var(--surface-three);
		}
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
