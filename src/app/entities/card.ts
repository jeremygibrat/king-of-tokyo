import { actionCards } from "./card.data";
import { Card, Player } from "./model";

export function getRandomCard() {
    return getAllCards()[Math.floor(Math.random() * getAllCards().length)];
}

export function onlyPermanentCards(cards: Card[]) {
    return cards.filter((c: any) => c.type != 'ACTION');
}

export function removeCardByName(cards: Card[], name: string) {
    return cards.filter(c => c.name !== name);
}

export function getAllCards() {
    const allCards: Card[] = []
    return allCards.concat(actionCards)    // .concat(powerCards);
}

export function playCard(card: Card, player: Player, allPlayers: Player[]) {
    let results: string[] = [];
    card.effects.forEach(effect => {
        const res = effect.apply(player, allPlayers);
        results = results.concat(res);
    });
    return results;
}

export function playCards(cards: Card[], player: Player, allPlayers: Player[]) {
    let results: string[] = [];
    cards.forEach(card => {
        const res = playCard(card, player, allPlayers);
        results = results.concat(res);
    });
    return results;
}
