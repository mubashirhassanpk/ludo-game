export type PlayerColor = 'red' | 'blue' | 'green' | 'yellow';

export interface Pawn {
  id: string;
  playerId: string;
  position: number; // -1 for base, 0-51 for board positions, 52-57 for home path
  isInBase: boolean;
  isInHome: boolean;
  isSafe: boolean;
}

export interface Player {
  id: string;
  name: string;
  color: PlayerColor;
  pawns: Pawn[];
  isAI: boolean;
  isWinner: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number;
  gamePhase: 'waiting' | 'rolling' | 'moving' | 'finished';
  possibleMoves: string[];
  selectedPawn: string | null;
  winner: string | null;
  gameMode: 'offline' | 'ai' | 'online';
  aiDifficulty: 'easy' | 'medium' | 'hard';
}

export interface Position {
  x: number;
  y: number;
}
