import { createDiceByType, DiceSideType, filterDiceByType } from "./dice";
import { Player } from "./model";

export enum TargetType {
    SELF,
    ALL_OTHERS,
    ALL,
}

export interface Target {
    type: TargetType;
}

abstract class Effect {
    constructor(public target: Target, public isActive: boolean) {
        this.isActive = isActive;
    }

    abstract shouldApply(player: Player, allPlayers: Player[], dices: any[]): boolean;

    abstract apply(player: Player, allPlayers: Player[], dices: any[]): string[];

    getTargetPlayers(player: Player, allPlayers: Player[]): Player[] {
        switch (this.target.type) {
            case TargetType.SELF:
                return [player];
            case TargetType.ALL_OTHERS:
                return allPlayers.filter(p => p !== player);
            case TargetType.ALL:
                return allPlayers;
        }
    }
}

export class PointsEffect extends Effect {
    constructor(public points: number, target: Target) {
        super(target, true); // L'effet est toujours actif par défaut
    }

    shouldApply(player: Player, allPlayers: Player[]): boolean {
        return true; // L'effet doit toujours être appliqué
    }

    apply(player: Player, allPlayers: Player[]) {
        const results: string[] = [];
        const targetPlayers = this.getTargetPlayers(player, allPlayers);
        targetPlayers.forEach(p => {
            results.push(`Player ${p.name} gained ${this.points}★`);
            p.points += this.points
        });
        return results;
    }
}

export class HealthEffect extends Effect {
    constructor(public health: number, target: Target) {
        super(target, true); // L'effet est toujours actif par défaut
    }

    shouldApply(player: Player, allPlayers: Player[]): boolean {
        return true; // L'effet doit toujours être appliqué
    }

    apply(player: Player, allPlayers: Player[]) {
        const results: string[] = [];
        const targetPlayers = this.getTargetPlayers(player, allPlayers);
        targetPlayers.forEach(p => {
            results.push(`Player ${p.name} gained ${this.health}♡`);
            p.life += this.health
        });
        return results;
    }
}

export class EnergyDrainEffect extends Effect {
    constructor(public points: number, public energyDrainRatio: number, target: Target) {
        super(target, true);
    }

    shouldApply(player: Player, allPlayers: Player[]): boolean {
        return true; // L'effet doit toujours être appliqué
    }

    apply(player: Player, allPlayers: Player[]) {
        const results: string[] = [];
        const targetPlayers = this.getTargetPlayers(player, allPlayers);
        player.points += this.points;

        targetPlayers.forEach(p => {
            const energyLoss = Math.floor(p.energy / this.energyDrainRatio);
            p.energy -= energyLoss;
            results.push(`Player ${p.name} lost ${energyLoss}$`);
        });
        return results;
    }
}

export class TakeTokyo extends Effect {
    constructor(public points: number, target: Target) {
        super(target, true);
    }

    shouldApply(player: Player, allPlayers: Player[]): boolean {
        return true; // L'effet doit toujours être appliqué
    }

    apply(player: Player, allPlayers: Player[]) {
        const results: string[] = [];
        player.points += this.points;
        results.push(`Player ${player.name} gained ${this.points}★`);

        if (!player.cityName) {
            const playersInCities = allPlayers.filter(p => p !== player).filter(p => p.cityName != null);
            const playerExited = playersInCities[Math.floor(Math.random() * playersInCities.length)]
            if (playerExited) {
                player.cityName = playerExited.cityName;
                playerExited.cityName = null;
                results.push(`Player ${player.name} took place in city ${player.cityName} instead of ${playerExited.name}`);
            }
        }
        return results;
    }
}

export class ExtraTurn extends Effect {
    constructor(target: Target) {
        super(target, true);
    }

    shouldApply(player: Player, allPlayers: Player[]): boolean {
        return true; // L'effet doit toujours être appliqué
    }

    apply(player: Player, allPlayers: Player[]) {
        const results: string[] = [];
        const targetPlayers = this.getTargetPlayers(player, allPlayers);

        targetPlayers.forEach(p => {
            results.push(`Player ${p.name} gained an extra turn`);
        })
        targetPlayers.forEach(p => p.extraTurn = true);
        return results;
    }
}

// Définition des effets des cartes pouvoir
export class PowerEffect extends Effect {
    constructor(
        target: Target,
        isActive: boolean,
        public condition: (player: Player, allPlayers: Player[], dices: any[]) => boolean,
        public effect: (player: Player, allPlayers: Player[], dices: any[]) => string[]
    ) {
        super(target, isActive);
    }

    shouldApply(player: Player, allPlayers: Player[], dices: any[]): boolean {
        return this.isActive && this.condition(player, allPlayers, dices);
    }

    apply(player: Player, allPlayers: Player[], dices: any[]) {
        let results: string[] = [];
        if (this.shouldApply(player, allPlayers, dices)) {
            results = results.concat(this.effect(player, allPlayers, dices));
        }
        return results;
    }
}

export const tooCuteEffect = new PowerEffect(
    { type: TargetType.SELF },
    true,
    (player, allPlayers) => allPlayers.every(p => p.points >= player.points),
    (player) => {
        player.points++;
        return [`${player.name} gained 1 point with 'Too Cute' card`]
    }
);

export const urbavoreEffect = new PowerEffect(
    { type: TargetType.SELF },
    true,
    (player, allPlayers) => player.cityName != null,
    (player, allPlayers, dices) => {
        const logs = [];
        player.points++;
        logs.push(`${player.name} gained 1 point with 'Urbavore' card`);
        const attackDices = filterDiceByType(dices, DiceSideType.ATTACK)
        if (attackDices.length > 0) {
            dices.push(createDiceByType(DiceSideType.ATTACK));
            logs.push(`${player.name} gained 1 attack with 'Urbavore' card`);
        }
        return logs
    }
);

export const spinyTailEffect = new PowerEffect(
    { type: TargetType.SELF },
    true,
    (player, allPlayers, dices) => filterDiceByType(dices, DiceSideType.ATTACK).length > 0,
    (player, allPlayers, dices) => {
        dices.push(createDiceByType(DiceSideType.ATTACK));
        return [`${player.name} gained 1 attack with 'Spiny Tail' card`]
    }
);

export const regenerationEffect = new PowerEffect(
    { type: TargetType.SELF },
    true,
    (player, allPlayers, dices) => filterDiceByType(dices, DiceSideType.HEAL).length > 0,
    (player, allPlayers, dices) => {
        dices.push(createDiceByType(DiceSideType.HEAL));
        return [`${player.name} gained 1 heal with 'Regeneration' card`]
    }
);

export const alphaMonsterEffect = new PowerEffect(
    { type: TargetType.SELF },
    true,
    (player, allPlayers, dices) => filterDiceByType(dices, DiceSideType.ATTACK).length > 0,
    (player, allPlayers, dices) => {
        player.points++;
        return [`${player.name} gained 1 point with 'Alpha Monster' card`]
    }
);

export const acidAttackEffect = new PowerEffect(
    { type: TargetType.SELF },
    true,
    (player, allPlayers, dices) => true,
    (player, allPlayers, dices) => {
        dices.push(createDiceByType(DiceSideType.ATTACK));
        return [`${player.name} gained 1 attack with 'Acid Attack' card`]
    }
);
export const friendOfChildrenEffect = new PowerEffect(
    { type: TargetType.SELF },
    true,
    (player, allPlayers, dices) => filterDiceByType(dices, DiceSideType.ENERGY).length > 0,
    (player, allPlayers, dices) => {
        dices.push(createDiceByType(DiceSideType.ENERGY));
        return [`${player.name} gained 1$ with 'Friend of children' card`]
    }
);
