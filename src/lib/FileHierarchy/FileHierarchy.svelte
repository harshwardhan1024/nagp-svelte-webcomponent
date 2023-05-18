<script lang="ts">
    import { fileStore } from "../file-store";
    import FileHierarchyItem from "./FileHierarchyItem.svelte";
</script>

<svelte:options tag="file-hierarchy" />

{#if $fileStore.length === 0}
<div class="empty">
    <p>Empty. Please add a file or directory.</p>
</div>
{:else}
{#each $fileStore as node}
    <FileHierarchyItem node={node}/>
{/each}
{/if}

<style>
    .empty {
        width: 100%;
        min-height: 400px;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
</style>