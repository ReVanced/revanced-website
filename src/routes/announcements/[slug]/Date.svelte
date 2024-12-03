<script lang="ts">
	import moment from 'moment';

	export let isEditing, isCreating, isPreviewing, createdAt;
</script>

{#if (isEditing || isCreating) && !isPreviewing}
	<!-- TODO -->
{:else}
	<span>
		{moment(createdAt).format('MMMM D, YYYY [at] h:mm A')}
	</span>
{/if}
