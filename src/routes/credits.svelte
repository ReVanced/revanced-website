<script>
    import ContributorHost from '$lib/components/molecules/ContributorHost.svelte';
    let peoples = [
        "Ushie",
        "afnzmn",
        "baiorett",
        "PickleNik",
    ]
</script>

<div class="wrapper">
    <ContributorHost {peoples}></ContributorHost>
</div>