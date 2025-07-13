import React, { useState } from 'react';
import { GameState, Player } from './types/game';
import { createPlayer } from './utils/gameLogic';
import GameSetup, { GameConfig } from './components/GameSetup';
import GameBoard from './components/GameBoard';

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const startGame = (config: GameConfig) => {
    const players: Player[] = [];
    
    // Create human player(s)
    if (config.mode === 'offline') {
      // All players are human in offline mode
      for (let i = 0; i < config.playerCount; i++) {
        players.push(createPlayer(
          `player-${i}`,
          config.playerNames[i],
          config.playerColors[i],
          false
        ));
      }
    } else {
      // First player is human, others are AI
      players.push(createPlayer(
        'player-0',
        config.playerNames[0],
        config.playerColors[0],
        false
      ));
      
      for (let i = 1; i < config.playerCount; i++) {
        players.push(createPlayer(
          `player-${i}`,
          `AI ${i}`,
          config.playerColors[i],
          true
        ));
      }
    }

    const initialGameState: GameState = {
      players,
      currentPlayerIndex: 0,
      diceValue: 0,
      gamePhase: 'rolling',
      possibleMoves: [],
      selectedPawn: null,
      winner: null,
      gameMode: config.mode,
      aiDifficulty: config.aiDifficulty
    };

    setGameState(initialGameState);
  };

  const handleGameStateChange = (newState: GameState) => {
    setGameState(newState);
  };

  const backToMenu = () => {
    setGameState(null);
  };

  return (
    <div className="App">
      {!gameState ? (
        <GameSetup onStartGame={startGame} />
      ) : (
        <GameBoard
          gameState={gameState}
          onGameStateChange={handleGameStateChange}
          onBackToMenu={backToMenu}
        />
      )}
    </div>
  );
}

export default App;
