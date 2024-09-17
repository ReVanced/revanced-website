<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';

	export let stretchFirst: boolean = false,
		gridGap: string = '0.5em',
		colWidth: string = 'minmax(Min(20em, 100%), 1fr)',
		items: any[] = []; // pass in data if it's dynamically updated

	type Grid = { _el: HTMLElement; gap: number; items: HTMLElement[]; ncol: number; mod: number };

	let grids: Grid[] = [],
		masonryElement: HTMLElement;

	export let reset: boolean = false;
	$: if (reset) masonryElement = masonryElement;

	export const refreshLayout = async () => {
		// console.log("REFRESHING LAYOUT")
		grids.forEach(async (grid) => {
			/* get the post relayout number of columns */
			const ncol = getComputedStyle(grid._el).gridTemplateColumns.split(' ').length;

			grid.items.forEach((item) => {
				const new_h = item.getBoundingClientRect().height;

				if (new_h !== +parseInt(item.dataset.h!)) {
					item.dataset.h = new_h.toString();
					grid.mod++;
				}
			});

			/* if the number of columns has changed */
			if (grid.ncol !== ncol || grid.mod) {
				/* update number of columns */
				grid.ncol = ncol;
				/* revert to initial positioning, no margin */
				grid.items.forEach((item) => item.style.removeProperty('margin-top'));
				/* if we have more than one column */
				if (grid.ncol > 1)
					grid.items.slice(ncol).forEach((item, i) => {
						let prev_fin =
								grid.items[i].getBoundingClientRect().bottom /* bottom edge of item above */,
							curr_ini = item.getBoundingClientRect().top; /* top edge of current item */

						item.style.marginTop = `${prev_fin + grid.gap - curr_ini}px`;
					});

				grid.mod = 0;
			}
		});
	};

	const calcGrid = async (_masonryArr: Array<HTMLElement>) => {
		await tick();
		if (_masonryArr.length && getComputedStyle(_masonryArr[0]).gridTemplateRows !== 'masonry') {
			grids = _masonryArr.map((grid) => {
				return {
					_el: grid,
					gap: parseFloat(getComputedStyle(grid).rowGap),
					items: [...Array.from(grid.childNodes)].filter(
						(item: any) => item.nodeType === 1 && +getComputedStyle(item).gridColumnEnd !== -1
					) as HTMLElement[],
					ncol: 0,
					mod: 0
				};
			});
			refreshLayout(); /* initial load */
		}
	};

	let _window: Window;
	onMount(() => {
		_window = window;
		_window.addEventListener('resize', refreshLayout, false); /* on resize */
	});
	onDestroy(() => {
		if (_window) _window.removeEventListener('resize', refreshLayout, false); /* on resize */
	});

	$: if (masonryElement) calcGrid([masonryElement]);

	$: if (items) {
		// update if items are changed
		masonryElement = masonryElement; // refresh masonryElement
	}
</script>

<!--
  An almost direct copy and paste of: https://css-tricks.com/a-lightweight-masonry-solution

  Usage:
    - stretchFirst stretches the first item across the top

  <Masonry stretchFirst={true} >
    {#each data as o}
      <div class="_card _padding">
        Here's some stuff {o.name}
        <header>
          <h3>{o.name}</h3>
        </header>
        <section>
          <p>{o.text}</p>
        </section>
      </div>
    {/each}
  </Masonry>
 -->

<div
	bind:this={masonryElement}
	class={`__grid--masonry ${stretchFirst ? '__stretch-first' : ''}`}
	style={`--grid-gap: ${gridGap}; --col-width: ${colWidth};`}
>
	<slot></slot>
</div>

<!--
$w: var(--col-width); // minmax(Min(20em, 100%), 1fr);
$s: var(--grid-gap); // .5em;
-->

<style>
	:global(.__grid--masonry) {
		display: grid;
		grid-template-columns: repeat(auto-fit, var(--col-width));
		grid-template-rows: masonry;
		justify-content: center;
		grid-gap: var(--grid-gap);
		padding: var(--grid-gap);
	}
	:global(.__grid--masonry > *) {
		align-self: start;
	}
	:global(.__grid--masonry.__stretch-first > *:first-child) {
		grid-column: 1/ -1;
	}
</style>
