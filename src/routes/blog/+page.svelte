<script lang="ts">
export let data;
</script>
<h1>Blog posts</h1>
<div>
{#each data.posts as post}
  <div>
    <h2>{post.attributes.title}</h2>
    <p>
      {post.attributes.description}
    </p>
    <a href="/blog/{post.attributes.slug}">link</a>
  </div>
{/each}
</div>
