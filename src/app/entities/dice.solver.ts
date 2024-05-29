import { DiceSideType, filterDiceByType } from "./dice";
import { Player } from "./model";
import { getPlayersAlive } from "./player";

export function solveDices(player: Player, allPlayers: Player[], dices: string[]) {
    const results: string[] = [];
    if (player) {
        results.push(`${player.name} a obtenu: ${dices.map((d: any) => d.label).join(' - ')}`);
        calculatePointsDices(player, dices, results);
        calculateEnergyDices(player, dices, results);
        calculateAttackDices(player, allPlayers, dices, results);
        calculateHealDices(player, dices, results);
    }

    return results;
}

function calculatePointsDices(player: Player, dices: any[], results: string[]) {
    const nbSimilarSides = 3;
    for (let i = 1; i <= 3; i++) {
        const pointsDices = dices.filter((d: any) => d.value === i);
        const gainedPoints = pointsDices.length >= nbSimilarSides ? (i + pointsDices.length - nbSimilarSides) : 0;
        player.points = gainedPoints;
        if (gainedPoints > 0) {
            results.push(`${player.name} gagne ${gainedPoints}★`);
        }
    }
}

function calculateEnergyDices(player: Player, dices: any[], results: string[]) {
    const energyDices = filterDiceByType(dices, DiceSideType.ENERGY);
    energyDices.forEach(() => {
        results.push(`${player.name} gagne 1$`);
        player.energy += 1;
    });
}

function calculateAttackDices(player: Player, allPlayers: Player[], dices: any[], results: string[]) {
    const attackDices = filterDiceByType(dices, DiceSideType.ATTACK);
    attackDices.forEach(() => {
        getPlayersAlive(allPlayers).filter(pl => {
            if (player.cityName === null) {
                return pl.cityName !== null;
            } else {
                return pl.cityName === null;
            }
        }).forEach(pl => {
            results.push(`${player.name} inflige 1 dégat à ${pl.name}`);
            pl.life--;
            if (pl.life === 0) {
                pl.cityName = null;
                results.push(`${pl.name} a succombé à ses blessures !`);
            }
        });
    });
}

function calculateHealDices(player: Player, dices: any[], results: string[]) {
    const healDices = filterDiceByType(dices, DiceSideType.HEAL);
    healDices.forEach(() => {
        if (player.cityName) {
            results.push(`${player.name} n'a pas pu se soigner car il est en ville`);
        } else {
            if (player.life < player.maxLife) {
                results.push(`${player.name} gagne 1♡`);
                player.life += 1;
            } else {
                results.push(`${player.name} n'a pas pu se soigner, il est a son maximum`);
            }
        }
    });
}