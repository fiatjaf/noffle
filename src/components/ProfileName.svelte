<script>
  export let meta
</script>

{#if meta.domain && meta.domainVerified}
  <a href={`https://${meta.domain}`}>{meta.domain}</a>
  {#if meta.name} ({meta.name}){/if}
{:else}
  {meta.name || 'Unnamed'}
{/if}
