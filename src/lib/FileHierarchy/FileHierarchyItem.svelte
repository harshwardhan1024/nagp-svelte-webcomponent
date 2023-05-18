<script lang="ts">
    import type { Node } from "../node";
    import fileIcon from "./../../assets/file.png";
    import directoryIcon from "./../../assets/folder.png";

    // Props
    export let node: Node = { id: '', name: '', isFile: false, children: [] };
    export let level = 0;

    // State
    let showChildren = false;

    function toggleShowChildren(): void {
        showChildren = !showChildren;
    }
    
</script>

<svelte:options tag="file-hierarchy-item" />

{#if node.isFile}

<div style={`margin-left: ${level * 64}px; padding: 16px; background-color: white; cursor: default;`}>
    <div style="display: flex; flex-direction: row; align-items: center;">
        <img width="24" height="24" style="margin-right: 8px" src={fileIcon} alt="File icon"/>
        <div>
            <p style="margin: 0; font-size: 16px; font-weight: 500">{node.name}</p>
        </div>
    </div>
</div>

{:else}

<div on:click={toggleShowChildren} style={`margin-left: ${level * 64}px; padding: 16px; background-color: white; cursor: pointer;`}>
    <div style="display: flex; flex-direction: row; align-items: center;">
        <img width="24" height="24" style="margin-right: 8px" src={directoryIcon} alt="Directory icon"/>
        <div style="display: flex; flex-direction: column;">
            <p style="margin: 0; font-size: 16px; font-weight: 500">{node.name}</p>
            <div style="font-size: 12px; display: flex; flex-direction: row; column-gap: 10px; color: #6b7280">
                <p style="margin: 0;">Directories: {node.children.filter(n => !n.isFile).length}</p>
                <p style="margin: 0;">Files: {node.children.filter(n => n.isFile).length}</p>
            </div>
        </div>
    </div>
</div>

<div style={`transition: max-height 0.75s ease-in-out; overflow: hidden; max-height: ${showChildren ? '1000px' : '0px'}; `}>
    {#each node.children as childNode }
        <div style="border-top: 1px solid #e2e8f0;">
            <svelte:self node={childNode} level={level + 1}/>
        </div>
    {/each}
</div>

{/if}