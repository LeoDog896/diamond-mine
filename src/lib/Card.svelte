<script lang="ts">
	import { Suite, numberToDescription, type CardData } from './card';

    export let data: CardData;

    export let mouseOver = false;

    $: top = (data.revealed ? (Suite[data.suite] as any as number) : 4) * 315.0
    $: left = (data.revealed ? (data.number - 1) : 2) * 202.5
</script>
  
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    aria-label="{numberToDescription(data.number)} of {data.suite}"
    style="--top: -{top}px; --left: -{left}px;"
    on:mouseenter={() => mouseOver = true}
    on:mouseleave={() => mouseOver = false}
></div>

<style lang="scss">
    div {
        width: var(--cardWidth);
        height: var(--cardHeight);
        background: url("anglo.svg") var(--left) var(--top);
        position: relative;
        user-select: none;
    }
</style>
