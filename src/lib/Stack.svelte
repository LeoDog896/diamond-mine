<script lang="ts" context="module">
    import type { CardData } from "./card";

    export type StackData = {
        card: CardData, 
        stack?: StackData
    } | undefined;

    function cardCount(data: StackData): number {
        if (data === undefined) return 0;
        
        let count = 1;
        while (data.stack) {
            data = data?.stack;
            count++;
        }

        return count
    }

    let zIncrement = 0;
</script>

<script lang="ts" strictEvents>
    import { draggable } from '@neodrag/svelte';
    
	import Card from "./Card.svelte";
	import { createEventDispatcher } from "svelte";

    let dispatch = createEventDispatcher<{
        startDrag: void,
        endDrag: void,
    }>();

    let localZ = 0;
    
    let cardDiv: HTMLDivElement;

    let position = { x: 0, y: 0 };

    export let stack: StackData;
    export let dragPredicate: (stack: StackData) => boolean = () => true

    export let mouseOver = false;

    $: subCards = cardCount(stack)
    $: isOnTop = !stack?.stack

    $: isDraggable = dragPredicate(stack) // must be draggable
            && stack?.card.revealed // and revealed
            && (!onlyTopOfStack || isOnTop) // if on top of stack, must be on top

    /** Whether cards should only be allowed to be drawn from the top of the stack */
    export let onlyTopOfStack = false;

    let isBeingDragged = false;

    function startDragPropagate() {
        localZ = ++zIncrement
        dispatch('startDrag');
    }

    function startDrag() {
        startDragPropagate()
        isBeingDragged = true;
    }

    function endDrag() {
        position = { x: 0, y: 0 };
        dispatch('endDrag');
        isBeingDragged = false;
    }
</script>

<div
    class="stack"
    class:over={mouseOver && isOnTop}
    class:isDraggable
    class:isBeingDragged
    style="z-index: {localZ}; height: calc(var(--cardHeight) + {subCards - 1} * 50px);"
    use:draggable={{ 
        bounds: 'body',
        handle: cardDiv,
        position,
        disabled: !isDraggable,
        onDragStart: startDrag,
        onDragEnd: endDrag
    }}
>
    {#if stack}
        <div
            class="cardBind"
            bind:this={cardDiv}
        >
            <Card data={stack.card} bind:mouseOver />
        </div>
        {#if stack.stack}
            <div class="subStack">
                <svelte:self
                    stack={stack.stack}
                    on:startDrag={startDragPropagate}
                    {dragPredicate}
                />
            </div>
        {/if}
    {/if}
</div>

<style lang="scss">
    .stack {
        position: relative;

        &.isDraggable {
            cursor: grab;

            &:hover {
                filter: brightness(80%);
            }
        }

        &:not(.isDraggable) {
            cursor: not-allowed;
        }

        &.isBeingDragged {
            pointer-events: none;
        }
    }

    .subStack {
        position: relative;
        top: calc(-1 * var(--cardHeight) + 50px);
    }
</style>
