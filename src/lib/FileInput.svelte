<script lang="ts">
    import { fileStore } from "./file-store";
    import { v4 as uuidv4 } from "uuid";
    import type { Node } from "./node";
 
    // State
    let name = '';
    let isFile = true;
    let saveAtRoot = true;
    let parentDirectoryIdToSaveIn: string | null = null;
    let error = false;

    function onNameInput(e: Event): void {
        const target = e.target as HTMLInputElement;
        name = target.value;
        error = false;
    }

    function updateFileStore(): void {
        const node = { id: uuidv4(), name: name.trim(), isFile, children: [] };

        if (saveAtRoot) {
            if (!isUniqueName(node.name, null)) {
                error = true;
                return;
            }
            fileStore.update(nodes => [...nodes, node]);
        } else {
            const parentNode = $fileStore.find(n => n.id == parentDirectoryIdToSaveIn);
            if (!parentNode)
                return;

            if (!isUniqueName(node.name, parentNode)) {
                error = true;
                return;
            }

            parentNode.children = [...parentNode.children, node];
            fileStore.update(nodes => [...nodes]);
        }
        
        resetForm();
    }

    function isUniqueName(name: string, parent: Node | null): boolean {
        let i = 0;
        if (!parent)
            i = $fileStore.findIndex(n => n.name === name);
        else
            i = parent.children.findIndex(n => n.name === name);

        return i === -1;
    }

    function resetForm() {
        name = '';
        isFile = true;
        saveAtRoot = true;
        parentDirectoryIdToSaveIn = null;
    }

    function isDisabled(name: string, saveAtRoot: boolean, parentDirectoryIdToSaveIn: string | null) {
        return name.trim().length === 0 || (!saveAtRoot && parentDirectoryIdToSaveIn === null)
    }

</script>

<svelte:options tag="file-input" />

<div class="flex-column">
    <input 
        type="text" 
        maxlength="150" 
        part="name-input"
        class="margin-bottom"
        placeholder="File/Directory Name"
        value={name}
        on:input={onNameInput}/>

    <span class="margin-bottom flex flex-row items-center column-gap-sm">
        <input 
            name="isFile" 
            type="checkbox" 
            bind:checked={isFile} />
        <label for="isFile">Is File</label>
    </span>

    <div class={$fileStore.filter(n => !n.isFile).length === 0 ? 'warning flex-column margin-top-md' : 'flex-column margin-top-md'}>
        <span class="flex flex-row items-center column-gap-sm margin-bottom">
            <input 
                name="saveAtRoot" 
                type="checkbox" 
                disabled='{$fileStore.filter(n => !n.isFile).length === 0}'
                bind:checked={saveAtRoot} />
            <label for="saveAtRoot">Save at Root</label>
        </span>

        <select bind:value={parentDirectoryIdToSaveIn} disabled={saveAtRoot} part={saveAtRoot ? "parent-input-disabled" : "parent-input"}>
            {#each $fileStore.filter(n => !n.isFile) as node}
            <option value={node.id}>{node.name}</option>
            {/each}
        </select>

        {#if $fileStore.filter(n => !n.isFile).length === 0}
            <p class="warning-text">Please add a directory to enable these options.</p>
        {/if}
    </div>

    <div class="margin-top-lg flex-row column-gap">
        <button 
            class="flex-one"
            part={isDisabled(name, saveAtRoot, parentDirectoryIdToSaveIn) ? "save-btn-disabled" : "save-btn"}
            on:click={updateFileStore}
            disabled="{isDisabled(name, saveAtRoot, parentDirectoryIdToSaveIn)}">
            Save
        </button>
        <button 
            class="flex-one"
            part="cancel-btn"
            on:click={resetForm}>
            Cancel
        </button>
    </div>

    {#if error}
        <p class="error">Name must be unique among siblings.</p>
    {/if}
</div>

<style>
.flex-column {
    display: flex;
    flex-direction: column;
}

.flex-row {
    display: flex;
    flex-direction: row;
}

.flex-one {
    flex: 1;
}

.column-gap {
    column-gap: 16px;
}

.column-gap-sm {
    column-gap: 8px;
}

.margin-bottom {
    margin-bottom: 8px;
}

.margin-top-md {
    margin-top: 16px;
}

.margin-top-lg {
    margin-top: 32px;
}

.warning {
    padding: 8px;
    border: 2px dotted #fcd34d;
    border-radius: 8px;
}

.warning-text {
    background-color: #fde68a;
    padding: 8px;
    color: #000;
    margin-bottom: 0px;
    border-radius: 8px;
}

.error {
    width: 100%;
    text-align: center;
    color: #b91c1c;
}
</style>