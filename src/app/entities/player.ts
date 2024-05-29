import { Card, Player } from "./model";

export const mockPlayerList = ['The King', 'Space Penguin', 'Cyber Kitty', 'Gigazaur', 'Alienoid', 'Meka Dragon'];

export function createPlayer(name: string, rank: number, startLife: number) {
    return {
        rank: rank,
        name: name,
        cityName: null,
        life: startLife,
        maxLife: startLife,
        energy: 0,
        points: 0,
        cards: [] as Card[],
        extraTurn: false
    }
}

export function createPlayers(name: string[], startLife: number) {
    return name.map((name, index) => {
        return createPlayer(name, index, startLife);
    });
}

export function getCurrentPlayer(players: Player[]) {
    return players.find(p => p.rank === 0);
}

export function getPlayersAlive(players: Player[]) {
    return players.filter(pl => pl.life > 0);
}

export function getCityLeaders(players: Player[]) {
    return players.filter(pl => pl.cityName != null);
}