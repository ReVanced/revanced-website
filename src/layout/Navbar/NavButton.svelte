<script lang="ts">
	import { page } from '$app/stores';
	export let href: string;
</script>

<a data-sveltekit-preload-data {href}>
	<!-- Check if href is equal to the first path -->
	<li class:selected={href === '/' + $page.url.pathname.split('/')[1]}>
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

	@media (max-width: 768px) {
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
