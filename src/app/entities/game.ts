import { getAllCards } from "./card";
import { getCities } from "./cities";
import { createDice } from "./dice";
import { Card, Player } from "./model";
import { createPlayers } from "./player";

export function getGameConfig() {
  return {
    cardsInShop: 3,
    nbRolls: 4,
    nbLife: 10,
    requiredVictoryPoints: 20,
    cards: getAllCards(),
    priceToClearShop: 2,
    nbSidesDice: 6,
    minPlayers: 2,
    maxPlayers: 6
  }
}

export function getGameInstance(playerNames: string[], nbLife: number) {
  return {
    cities: getCities(playerNames.length),
    cardsToBuy: [] as Card[],
    players: createPlayers(playerNames, nbLife),
    winners: [] as string[],
    currentTurn: {
      diceRolls: [] as any[],
      rollsRemaining: 0,
      maxRolls: 0,
      results: [] as string[]
    },
    isGameStarted: false
  }
}

export function getGameTurn(nbSidesDice: number, nbRolls: number) {
  return {
    diceRolls: createDice(nbSidesDice),
    rollsRemaining: nbRolls,
    maxRolls: nbRolls,
    results: []
  };
}

export function hasWinners(players: Player[], requiredVictoryPoints: number) {
  let winners: string[] = [];
  const winByScore = players.filter(p => p.points >= requiredVictoryPoints).map(p => p.name);
  const winBySurviving = players.filter(p => p.life > 0).length === 1 ? [players.filter(p => p.life > 0).map(p => p.name)[0]] : [];

  if (winByScore.length > 0 || winBySurviving.length > 0) {
    winByScore.forEach(w => {
      if (!winners.includes(w)) {
        winners.push(w);
      }
    });

    winBySurviving.forEach(w => {
      if (!winners.includes(w)) {
        winners.push(w);
      }
    });
  }
  return winners;
}