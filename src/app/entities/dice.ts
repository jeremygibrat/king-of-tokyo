export enum DiceSideType {
    POINT,
    ATTACK,
    ENERGY,
    HEAL
}

export function createDice(sideNumber: number) {
    const dices = [];
    for (let i = 1; i <= sideNumber; i++) {
        dices.push(createSide(i));
    }
    return dices;
}

export function createSide(value: number) {
    return { value: value, locked: false, label: getSideLabel(value) };
}

export function getSideLabel(sideNumber: number) {
    switch (sideNumber) {
        case 1:
        case 2:
        case 3:
            return sideNumber;
        case 4:
            return '💰'
        case 5:
            return '⚔'
        case 6:
            return '❤️'
        default:
            return '?'
    }
}

export function rollDice(dice: any, nbSides: number) {
    if (dice.locked) {
        dice.locked = false;
    } else {
        const value = Math.floor(Math.random() * nbSides) + 1;
        dice.value = value;
        dice.label = getSideLabel(value);
    }
}

export function createDiceByType(type: DiceSideType, value?: number) {
    switch (type) {
        case DiceSideType.POINT:
            return createSide(value ?? 1);
        case DiceSideType.ENERGY:
            return createSide(4);
        case DiceSideType.ATTACK:
            return createSide(5);
        case DiceSideType.HEAL:
            return createSide(6);
        default:
            console.error(`${type} is not a dice type recognized`)
            return [];
    }
}

export function filterDiceByType(dices: any[], type: DiceSideType) {
    switch (type) {
        case DiceSideType.POINT:
            return getPointDice(dices);
        case DiceSideType.ENERGY:
            return getEnergyDices(dices);
        case DiceSideType.ATTACK:
            return getAttackDices(dices);
        case DiceSideType.HEAL:
            return getHealDices(dices);
        default:
            console.error(`${type} is not a dice type recognized`)
            return [];
    }
}

function getPointDice(dices: any[]) {
    return dices.filter((d: any) => d.value === 1 || d.value === 2 || d.value === 3);
}

function getEnergyDices(dices: any[]) {
    return dices.filter((d: any) => d.value === 4);
}

function getAttackDices(dices: any[]) {
    return dices.filter((d: any) => d.value === 5);
}

function getHealDices(dices: any[]) {
    return dices.filter((d: any) => d.value === 6);
}