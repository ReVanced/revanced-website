<script lang="ts">
	import moment from 'moment';

	export let thumbnail_url: string =
		'https://repository-images.githubusercontent.com/731390704/b0ddaf49-d868-4bb5-866c-417a86ebbf65';
	export let title: string;
	export let author: string;
	export let created_at: string | Date;
</script>

<div class="announcement-card">
	<img src={thumbnail_url} alt="thumbnail" />
	<h2>{title}</h2>
	<h3>
		by
		<a class="author" href="http://github.com/{author}" target="_blank" rel="noopener noreferrer">
			{author}
		</a>,
		<span class="date">{moment(created_at).fromNow()}</span>
	</h3>
	{#if $$slots.channel}
		<div class="channel"><slot name="channel" /></div>
	{/if}
	<button class="read-more">Read more</button>
</div>

<style>
</style>
