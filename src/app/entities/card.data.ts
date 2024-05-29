import { ExtraTurn, TargetType, TakeTokyo, PointsEffect, HealthEffect, EnergyDrainEffect, tooCuteEffect, urbavoreEffect, spinyTailEffect, regenerationEffect, alphaMonsterEffect, acidAttackEffect, friendOfChildrenEffect } from "./card-effects";
import { Card } from "./model";

// Données des cartes avec les effets et les cibles
export const actionCards: Card[] = [
    { type: 'ACTION', name: 'Rage', price: 3, description: 'Jouez un autre tour après celui-là', effects: [new ExtraTurn({ type: TargetType.SELF })] },
    { type: 'ACTION', name: 'La mort vient du ciel', price: 5, description: '+2★ et prenez le controle de Tokyo si vous n\'y etes pas déjà', effects: [new TakeTokyo(2, { type: TargetType.SELF })] },
    { type: 'ACTION', name: 'Gratte-Ciel', price: 6, description: '+4★', effects: [new PointsEffect(4, { type: TargetType.SELF })] },
    { type: 'ACTION', name: 'Raffinerie de gaz', price: 6, description: '+2★ et les autres Monstres perdent 3♡', effects: [new PointsEffect(2, { type: TargetType.SELF }), new HealthEffect(-3, { type: TargetType.ALL_OTHERS })] },
    { type: 'ACTION', name: 'Immeuble', price: 5, description: '+3★', effects: [new PointsEffect(3, { type: TargetType.SELF })] },
    { type: 'ACTION', name: 'Soin', price: 3, description: '+2♡', effects: [new HealthEffect(2, { type: TargetType.SELF })] },
    { type: 'ACTION', name: 'Centrale nucléaire', price: 6, description: '+2★ +3♡', effects: [new PointsEffect(2, { type: TargetType.SELF }), new HealthEffect(3, { type: TargetType.SELF })] },
    { type: 'ACTION', name: 'Tempete magnétique', price: 6, description: '+2★ et tous les autres monstres perdent 1$ pour chaque 2$ qu\'ils possedent', effects: [new PointsEffect(2, { type: TargetType.SELF }), new EnergyDrainEffect(2, 2, { type: TargetType.ALL_OTHERS })] },
    { type: 'ACTION', name: 'Garde Nationale', price: 3, description: '+2★ -2♡', effects: [new PointsEffect(2, { type: TargetType.SELF }), new HealthEffect(-2, { type: TargetType.SELF })] },
    { type: 'ACTION', name: 'Recharge', price: 8, description: '+9$', effects: [new PointsEffect(9, { type: TargetType.SELF })] },
    { type: 'ACTION', name: 'Lance-flammes', price: 3, description: 'Tous les autres Monstres perdent 2♡', effects: [new HealthEffect(-2, { type: TargetType.ALL_OTHERS })] },
    { type: 'ACTION', name: 'Ordre d`évacuation', price: 7, description: 'Tous les autres Monstres perdent 5★', effects: [new PointsEffect(-5, { type: TargetType.ALL_OTHERS })] },
    { type: 'ACTION', name: 'Bombardement aérien', price: 4, description: 'Tous les autres Monstres perdent 3♡ (vous y compris)', effects: [new PointsEffect(-3, { type: TargetType.ALL })] },
    { type: 'ACTION', name: 'Tramway', price: 4, description: '+2★', effects: [new PointsEffect(2, { type: TargetType.SELF })] },
    { type: 'ACTION', name: 'La petite boutique du coin', price: 3, description: '+1★', effects: [new PointsEffect(1, { type: TargetType.SELF })] },
    { type: 'ACTION', name: 'Tank', price: 4, description: '+4★ -3♡', effects: [new PointsEffect(4, { type: TargetType.SELF }), new HealthEffect(-3, { type: TargetType.SELF })] },
    { type: 'ACTION', name: 'Avions de chasse', price: 5, description: '+5★ -4♡', effects: [new PointsEffect(5, { type: TargetType.SELF }), new HealthEffect(-4, { type: TargetType.SELF })] },
];

// todo: implements effects
export const powerCards: Card[] = [
    { type: 'POWER', name: 'Trop mignon', price: 3, description: 'Gagnez 1★ à la fin de votre tour si vous êtes le Monstre avec le moins d\'★', effects: [tooCuteEffect] },
    { type: 'POWER', name: 'Urbavore', price: 4, description: 'Gagnez 1★ supplémentaire lorsque vous commencez votre tour dans Tokyo. Si vous êtes dans Tokyo et que vous obtenez au moins 1⚔, ajoutez 1⚔ a votre résultat', effects: [urbavoreEffect] },
    { type: 'POWER', name: 'Queue à piquants', price: 5, description: 'Si vous obtenez au moins ⚔, ajoutez 1⚔ à votre résultat', effects: [spinyTailEffect] },
    { type: 'POWER', name: 'Régénération', price: 4, description: 'Lorsque vous gagnez des ♡, gagnez 1♡ supplémentaire', effects: [regenerationEffect] },
    { type: 'POWER', name: 'Monstre alpha', price: 5, description: 'Gagnez 1★ si vous obtenez au moins un ⚔', effects: [alphaMonsterEffect] },
    { type: 'POWER', name: 'Attaque acide', price: 6, description: 'Ajoutez 1⚔ à votre résultat', effects: [acidAttackEffect] },
    { type: 'POWER', name: 'Ami des enfants', price: 3, description: 'Gagnez 1$ supplémentaire chaque fois que vous gagnez au moins 1$', effects: [friendOfChildrenEffect] },
    { type: 'POWER', name: 'Métamorphose', price: 3, description: 'A la fin de votre tour vous pouvez defaussez les cartes POUVOIR de votre choix pour récuperer leur prix en $', effects: [] },
    { type: 'POWER', name: 'Plan B', price: 3, description: 'Avant de resoudre vos dés, vous pouvez défausser cette carte pour changer la face d\'un de vos dés', effects: [] },
    { type: 'POWER', name: 'Souffle de feu', price: 4, description: 'Vos voisins de table perdent 1♡ lorsque vous obtenez au moins un ⚔', effects: [] },
    { type: 'POWER', name: 'Dards empoisonnés', price: 3, description: 'Lorsque vous obtenez au moins 2 - 2 - 2, ajoutez 2⚔ à votre résultat', effects: [] },
    { type: 'POWER', name: 'Une tête de plus', price: 7, description: 'Jouez avec un dé supplémentaire', effects: [] },
    { type: 'POWER', name: 'Herbivore', price: 5, description: 'Gagnez 1★ à la fin de votre tour si vous n\'avez fait perdre aucun ♡', effects: [] },
    { type: 'POWER', name: 'Encore plus grand', price: 4, description: '+2♡ quand vous achetez cette carte. Vous pouvez avoir jusqu\'a 12♡ tant que vous possedez cette carte ', effects: [] },
    { type: 'POWER', name: 'Ninja urbain', price: 4, description: 'Vous pouvez toujours relancer les 3 que vous obtenez', effects: [] },
    { type: 'POWER', name: 'Boisson énergisante', price: 4, description: 'Dépensez 1$ pour avoir un Lancer supplémentaire', effects: [] },
    { type: 'POWER', name: 'Souffle nova', price: 7, description: 'Vos ⚔ font perdre des ♡ à tous les autres monstres', effects: [] },
]