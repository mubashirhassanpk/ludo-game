import { Player, Pawn, PlayerColor, GameState } from '../types/game';

// Board positions for each color (starting positions on the main track)
const STARTING_POSITIONS: Record<PlayerColor, number> = {
  red: 0,
  blue: 13,
  green: 26,
  yellow: 39
};

// Safe positions where pawns cannot be captured
const SAFE_POSITIONS = [0, 8, 13, 21, 26, 34, 39, 47];

// Home entrance positions for each color
const HOME_ENTRANCE: Record<PlayerColor, number> = {
  red: 51,
  blue: 12,
  green: 25,
  yellow: 38
};

export function createPlayer(id: string, name: string, color: PlayerColor, isAI: boolean = false): Player {
  const pawns: Pawn[] = [];
  for (let i = 0; i < 4; i++) {
    pawns.push({
      id: `${id}-pawn-${i}`,
      playerId: id,
      position: -1,
      isInBase: true,
      isInHome: false,
      isSafe: false
    });
  }

  return {
    id,
    name,
    color,
    pawns,
    isAI,
    isWinner: false
  };
}

export function canMovePawnOutOfBase(diceValue: number): boolean {
  return diceValue === 6;
}

export function getValidMoves(player: Player, diceValue: number): string[] {
  const validMoves: string[] = [];

  player.pawns.forEach(pawn => {
    if (pawn.isInBase && canMovePawnOutOfBase(diceValue)) {
      validMoves.push(pawn.id);
    } else if (!pawn.isInBase && !pawn.isInHome) {
      const newPosition = calculateNewPosition(pawn, diceValue, player.color);
      if (newPosition !== -1) {
        validMoves.push(pawn.id);
      }
    }
  });

  return validMoves;
}

export function calculateNewPosition(pawn: Pawn, diceValue: number, playerColor: PlayerColor): number {
  if (pawn.isInBase) {
    return STARTING_POSITIONS[playerColor];
  }

  if (pawn.isInHome) {
    return -1; // Cannot move if already in home
  }

  const currentPos = pawn.position;
  let newPos = currentPos + diceValue;

  // Check if pawn reaches or passes home entrance
  const homeEntrance = HOME_ENTRANCE[playerColor];
  const startPos = STARTING_POSITIONS[playerColor];
  
  // Calculate how many steps the pawn has taken from its starting position
  let stepsFromStart;
  if (currentPos >= startPos) {
    stepsFromStart = currentPos - startPos;
  } else {
    stepsFromStart = (52 - startPos) + currentPos;
  }

  // Check if pawn should enter home path (after completing almost full circle)
  if (stepsFromStart + diceValue >= 51) {
    const stepsIntoHome = (stepsFromStart + diceValue) - 51;
    if (stepsIntoHome <= 5) {
      return 52 + stepsIntoHome; // Home path positions 52-56
    } else {
      return -1; // Overshooting home
    }
  }

  // Handle wrapping around the board
  if (newPos >= 52) {
    newPos = newPos - 52;
  }

  return newPos;
}

export function movePawn(gameState: GameState, pawnId: string, newPosition: number): GameState {
  const newState = { ...gameState };
  const currentPlayer = newState.players[newState.currentPlayerIndex];
  const pawn = currentPlayer.pawns.find(p => p.id === pawnId);

  if (!pawn) return gameState;

  // Handle moving out of base
  if (pawn.isInBase && newPosition === STARTING_POSITIONS[currentPlayer.color]) {
    pawn.isInBase = false;
    pawn.position = newPosition;
    pawn.isSafe = SAFE_POSITIONS.includes(newPosition);
    return newState;
  }

  // Handle normal movement
  pawn.position = newPosition;
  pawn.isSafe = SAFE_POSITIONS.includes(newPosition) || newPosition >= 52;

  // Check if pawn reached home
  if (newPosition >= 52 && newPosition <= 57) {
    if (newPosition === 57) {
      pawn.isInHome = true;
    }
  }

  // Handle captures
  if (!pawn.isSafe && newPosition < 52) {
    newState.players.forEach(player => {
      if (player.id !== currentPlayer.id) {
        player.pawns.forEach(otherPawn => {
          if (otherPawn.position === newPosition && !otherPawn.isSafe) {
            // Send captured pawn back to base
            otherPawn.position = -1;
            otherPawn.isInBase = true;
            otherPawn.isSafe = false;
            otherPawn.isInHome = false;
          }
        });
      }
    });
  }

  // Check for winner
  const allPawnsHome = currentPlayer.pawns.every(p => p.isInHome);
  if (allPawnsHome) {
    currentPlayer.isWinner = true;
    newState.winner = currentPlayer.id;
    newState.gamePhase = 'finished';
  }

  return newState;
}

export function getNextPlayer(gameState: GameState, diceValue: number): number {
  // Player gets another turn if they rolled a 6
  if (diceValue === 6) {
    return gameState.currentPlayerIndex;
  }

  return (gameState.currentPlayerIndex + 1) % gameState.players.length;
}

export function rollDice(): number {
  return Math.floor(Math.random() * 6) + 1;
}

export function makeAIMove(gameState: GameState): { pawnId: string; position: number } | null {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const validMoves = getValidMoves(currentPlayer, gameState.diceValue);

  if (validMoves.length === 0) return null;

  // AI strategy based on difficulty
  const { aiDifficulty } = gameState;
  
  if (aiDifficulty === 'easy') {
    // Random move
    const randomPawnId = validMoves[Math.floor(Math.random() * validMoves.length)];
    const pawn = currentPlayer.pawns.find(p => p.id === randomPawnId)!;
    const newPosition = calculateNewPosition(pawn, gameState.diceValue, currentPlayer.color);
    return { pawnId: randomPawnId, position: newPosition };
  }

  // Medium/Hard: Prefer moves that capture opponents or get pawns closer to home
  let bestMove = { pawnId: validMoves[0], score: -1 };

  validMoves.forEach(pawnId => {
    const pawn = currentPlayer.pawns.find(p => p.id === pawnId)!;
    const newPosition = calculateNewPosition(pawn, gameState.diceValue, currentPlayer.color);
    let score = 0;

    // Prioritize getting pawns out of base
    if (pawn.isInBase) score += 10;

    // Prioritize moves that capture opponents
    gameState.players.forEach(player => {
      if (player.id !== currentPlayer.id) {
        player.pawns.forEach(otherPawn => {
          if (otherPawn.position === newPosition && !otherPawn.isSafe) {
            score += 15;
          }
        });
      }
    });

    // Prioritize getting closer to home
    if (newPosition >= 52) score += 5;

    if (score > bestMove.score) {
      bestMove = { pawnId, score };
    }
  });

  const pawn = currentPlayer.pawns.find(p => p.id === bestMove.pawnId)!;
  const newPosition = calculateNewPosition(pawn, gameState.diceValue, currentPlayer.color);
  
  return { pawnId: bestMove.pawnId, position: newPosition };
}
