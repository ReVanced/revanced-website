<script lang="ts">
	export let contributor: any;
	let alt = `${contributor.login}'s profile picture`;
</script>

<a href={contributor.html_url} rel="noreferrer" target="_blank">
	<img src={contributor.avatar_url} {alt} />
	<div class="text">
		<h5>{contributor.login}</h5>
		<h6>
			{contributor.contributions}
			{contributor.contributions > 1 ? 'contributions' : 'contribution'}
		</h6>
	</div>
</a>

<style>
	a {
		color: var(--white);
		text-decoration: none;
		cursor: pointer;
		padding: 0.9rem 1rem;
		width: 100%;
		transition: background-color 0.3s var(--bezier-one);
		display: flex;
		gap: 1rem;
		align-items: center;
		border-right: 1px solid var(--grey-three);
		border-bottom: 1px solid var(--grey-three);
	}

	a:hover {
		text-decoration: underline;
		text-decoration-style: wavy;
		text-decoration-color: var(--accent-color);
		color: var(--white);
	}

	h5 {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	h6 {
		color: var(--grey-eleven);
	}

	.text {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	img {
		border-radius: 50%;
		height: 32px;
		width: 32px;
		background-color: var(--grey-two);
		transition: transform 0.4s var(--bezier-one);
		user-select: none;
		--webkit-user-select: none;
	}

	@media (max-width: 768px) {
		img {
			height: 42px;
			width: 42px;
		}
		a {
			border: none;
			padding: 0.5rem;
		}
	}
</style>
