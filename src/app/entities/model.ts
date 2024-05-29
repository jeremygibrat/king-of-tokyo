export interface GameState {
  players: Player[];
  currentPlayer: number;
  currentPlayerId: string;
  deck: Card[];
  discardPile: Card[];
  rollValue: number;
  // etc
}

export interface Player {
  name: string;
  life: number;
  maxLife: number;
  energy: number;
  points: number;
  rank: number;
  extraTurn: boolean;
  cityName: string | null;
  cards: Card[]
  specialAbility?: string;
  // etc
}

export interface Card {
  id?: string;
  name: string;
  type: 'ACTION' | 'POWER' | 'EVOLUTION';
  price: number;
  description: string;
  effects: any[]
  // etc
}