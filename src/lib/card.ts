export enum Suite {
    CLUBS,
    DIAMONDS,
    HEARTS,
    SPADES,
}

export interface CardData {
    suite: Suite,
    number: number,
    revealed: boolean
}

export function numberToDescription(n: number) {
    if (n < 1) throw Error("Illegal card number");
    if (n < 10) return n;
    if (n == 11) return "Jack"
    if (n == 12) return "Queen"
    if (n == 13) return "King"
}

function getCards(): CardData[] {
    const cards: CardData[] = []
    for (const suite of Object.values(Suite).filter(x => isNaN(Number(x)))) {
        for (let i = 1; i <= 13; i++) {
            cards.push({
                suite: suite as Suite,
                number: i,
                revealed: true
            });
        }
    }

    return cards;
}

export const cards: readonly CardData[] = Object.freeze(getCards())
