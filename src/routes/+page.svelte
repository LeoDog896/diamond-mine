<script lang="ts">
	import { type CardData, cards, Suite } from '$lib/card';
    import Stack, { type StackData } from '$lib/Stack.svelte';

    // https://stackoverflow.com/questions/8495687/split-array-into-chunks
    function* chunks<T>(arr: T[], n: number): Generator<T[], void> {
        for (let i = 0; i < arr.length; i += n) {
            yield arr.slice(i, i + n);
        }
    }

    function createCards(): CardData[] {
        return cards
            .map(value => ({ ...value, revealed: false }))
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
    }

    function generateGameCards() {
        return [...chunks(createCards(), 4)]
            .map(chunk => chunk.with(-1, { ...chunk.at(-1)!, revealed: true }))
    }

    let gameCards: CardData[][] = generateGameCards()

    function cardsToStack(cards: CardData[]): StackData {
        if (cards.length === 0) return undefined;
        const reversedCards = cards.toReversed();
        return reversedCards.slice(1)
            .reduce((prev, card) => ({ card, stack: prev }), { card: reversedCards[0] })
    }
</script>

<button on:click={() => gameCards = generateGameCards()}>New Game</button>

<div class="stacks">
    {#each gameCards as stack}
        <Stack
            stack={cardsToStack(stack)}
            dragPredicate={(stack) => stack?.card.suite != Suite.DIAMONDS}
        />
    {/each}
</div>

<style lang="scss">
    .stacks {
        display: flex;
    }
</style>
