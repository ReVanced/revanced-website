<script lang="ts">
	let {
		viewBoxHeight,
		viewBoxWidth = viewBoxHeight,
		svgHeight,
		svgWidth = svgHeight,
		children
	}: {
		viewBoxHeight: number;
		viewBoxWidth?: number;
		svgHeight: number;
		svgWidth?: number;
		children?: any;
	} = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	preserveAspectRatio="none"
	viewBox="0 0 {viewBoxHeight} {viewBoxWidth}"
	style:height={svgHeight + 'px'}
	style:width={svgWidth + 'px'}
>
	{@render children?.()}
</svg>
