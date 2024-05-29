import { Player } from "./model";

export const mountains = ['Mont Fuji', 'Mont Blanc', 'Mont Etna', 'Mont Everest', 'K2', 'Kilimandjaro', 'Denali', 'Teide', 'Pic d\'Orizaba', 'Mont Blackburn',
    'Mont Ararat', 'Chimborazo', 'Mont Rainier', 'Aconcagua', 'Mont Kinabalu', 'Mont Damavand', 'Aoraki/Mont Cook', 'Toubkal', 'Pic d\'Aneto', 'Pic Talgar'];

export function getRandomCity() {
    return mountains[Math.floor(Math.random() * mountains.length)];
}

export function getCitiesNbByPlayers(nbPlayers: number) {
    if (nbPlayers <= 0) {
        return 0;
    }
    return Math.ceil((nbPlayers - 1) / 3);
}

export function getCities(nbPlayers: number) {
    let cities = [];
    for (let i = 0; i <= getCitiesNbByPlayers(nbPlayers); i++) {
        cities.push(getRandomCity());
    };
    return cities;
}

export function getOccupiedCities(players: Player[]) {
    return players.filter(p => p.cityName != null).map(p => p.cityName || '')
}

export function findFreeCity(allCities: string[], occupiedCities: string[]) {
    if (occupiedCities.length > 0) {
        const availableCities = allCities.filter(c => !occupiedCities.includes(c));
        return availableCities[0];
    } else {
        return allCities[0];
    }
}