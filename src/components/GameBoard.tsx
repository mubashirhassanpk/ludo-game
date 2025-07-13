import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState } from '../types/game';
import { getValidMoves, movePawn, getNextPlayer, rollDice, makeAIMove, calculateNewPosition } from '../utils/gameLogic';
import Board from './Board';
import Dice from './Dice';
import PlayerPanel from './PlayerPanel';
import { RotateCcw, Home } from 'lucide-react';

interface GameBoardProps {
  gameState: GameState;
  onGameStateChange: (newState: GameState) => void;
  onBackToMenu: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  gameState, 
  onGameStateChange, 
  onBackToMenu 
}) => {
  const [isRolling, setIsRolling] = useState(false);

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  useEffect(() => {
    // Handle AI turn
    if (currentPlayer.isAI && gameState.gamePhase === 'rolling') {
      const timer = setTimeout(() => {
        handleDiceRoll();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer.isAI, gameState.gamePhase]);

  useEffect(() => {
    // Handle AI move
    if (currentPlayer.isAI && gameState.gamePhase === 'moving' && gameState.possibleMoves.length > 0) {
      const timer = setTimeout(() => {
        const aiMove = makeAIMove(gameState);
        if (aiMove) {
          handlePawnMove(aiMove.pawnId);
        } else {
          // No valid moves, end turn
          endTurn();
        }
      }, 1500);
      return () => clearTimeout(timer);
    } else if (gameState.gamePhase === 'moving' && gameState.possibleMoves.length === 0) {
      // No valid moves for human player, auto-end turn
      const timer = setTimeout(() => {
        endTurn();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer.isAI, gameState.gamePhase, gameState.possibleMoves]);

  const handleDiceRoll = () => {
    if (gameState.gamePhase !== 'rolling' || isRolling) return;

    setIsRolling(true);
    
    setTimeout(() => {
      const diceValue = rollDice();
      const validMoves = getValidMoves(currentPlayer, diceValue);
      
      const newState: GameState = {
        ...gameState,
        diceValue,
        gamePhase: validMoves.length > 0 ? 'moving' : 'waiting',
        possibleMoves: validMoves
      };

      onGameStateChange(newState);
      setIsRolling(false);

      // If no valid moves, end turn after a delay
      if (validMoves.length === 0) {
        setTimeout(() => {
          endTurn();
        }, 1500);
      }
    }, 800);
  };

  const handlePawnMove = (pawnId: string) => {
    if (gameState.gamePhase !== 'moving' || !gameState.possibleMoves.includes(pawnId)) {
      return;
    }

    const pawn = currentPlayer.pawns.find(p => p.id === pawnId);
    if (!pawn) return;

    const newPosition = calculateNewPosition(pawn, gameState.diceValue, currentPlayer.color);
    if (newPosition === -1) return;

    const newState = movePawn(gameState, pawnId, newPosition);
    onGameStateChange(newState);

    // End turn after move (unless player rolled a 6)
    setTimeout(() => {
      if (gameState.diceValue !== 6) {
        endTurn();
      } else {
        // Player gets another turn
        const resetState: GameState = {
          ...newState,
          gamePhase: 'rolling',
          possibleMoves: [],
          selectedPawn: null
        };
        onGameStateChange(resetState);
      }
    }, 500);
  };

  const endTurn = () => {
    const nextPlayerIndex = getNextPlayer(gameState, gameState.diceValue);
    const newState: GameState = {
      ...gameState,
      currentPlayerIndex: nextPlayerIndex,
      gamePhase: 'rolling',
      possibleMoves: [],
      selectedPawn: null,
      diceValue: 0
    };
    onGameStateChange(newState);
  };

  const handlePawnClick = (pawnId: string) => {
    if (gameState.gamePhase === 'moving' && gameState.possibleMoves.includes(pawnId)) {
      handlePawnMove(pawnId);
    }
  };

  const resetGame = () => {
    if (window.confirm('Are you sure you want to restart the game?')) {
      onBackToMenu();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with buttons */}
        <div className="flex justify-end items-center mb-6 space-x-4">
          <motion.button
            className="bg-white text-gray-700 px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2 hover:bg-gray-50 font-medium border border-gray-200"
            onClick={resetGame}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </motion.button>
          
          <motion.button
            className="bg-white text-gray-700 px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2 hover:bg-gray-50 font-medium border border-gray-200"
            onClick={onBackToMenu}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Home className="w-5 h-5" />
            <span>Menu</span>
          </motion.button>
        </div>

        {/* Main game layout matching the reference image */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Left side - Player panels */}
          <div className="col-span-3 space-y-4">
            {gameState.players.slice(0, 2).map((player, index) => (
              <PlayerPanel
                key={player.id}
                player={player}
                isCurrentPlayer={index === gameState.currentPlayerIndex}
                isWinner={player.isWinner}
              />
            ))}
          </div>

          {/* Center - Game Board */}
          <div className="col-span-6 flex justify-center">
            <Board
              players={gameState.players}
              selectedPawn={gameState.selectedPawn}
              possibleMoves={gameState.possibleMoves}
              onPawnClick={handlePawnClick}
            />
          </div>

          {/* Right side - Game controls */}
          <div className="col-span-3 space-y-6">
            {/* Current Player & Dice */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-xl border border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-center mb-4 text-gray-800">
                {currentPlayer.name}'s Turn
              </h3>
              
              {/* Show current player's pawns */}
              <div className="flex justify-center items-center space-x-2 mb-6">
                <div className="flex space-x-1">
                  {currentPlayer.pawns.slice(0, 3).map((pawn, idx) => (
                    <div
                      key={pawn.id}
                      className={`w-6 h-6 rounded-full border-2 ${
                        currentPlayer.color === 'red' ? 'bg-red-500 border-red-600' :
                        currentPlayer.color === 'blue' ? 'bg-blue-500 border-blue-600' :
                        currentPlayer.color === 'green' ? 'bg-green-500 border-green-600' :
                        'bg-yellow-500 border-yellow-600'
                      }`}
                    />
                  ))}
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 ${
                    currentPlayer.color === 'red' ? 'bg-red-500 border-red-600' :
                    currentPlayer.color === 'blue' ? 'bg-blue-500 border-blue-600' :
                    currentPlayer.color === 'green' ? 'bg-green-500 border-green-600' :
                    'bg-yellow-500 border-yellow-600'
                  }`}
                />
              </div>
              
              <div className="flex flex-col items-center space-y-4">
                <Dice
                  value={gameState.diceValue}
                  isRolling={isRolling}
                  onRoll={handleDiceRoll}
                  disabled={
                    gameState.gamePhase !== 'rolling' || 
                    currentPlayer.isAI || 
                    isRolling
                  }
                />

                <div className="text-center text-sm text-gray-600">
                  Rolled: {gameState.diceValue || 0}
                </div>
              </div>

              {/* Game Status */}
              <div className="mt-6 text-center">
                <AnimatePresence mode="wait">
                  {gameState.gamePhase === 'rolling' && (
                    <motion.p
                      key="rolling"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-purple-600 font-medium"
                    >
                      {currentPlayer.isAI ? 'AI is rolling...' : 'Click to roll dice!'}
                    </motion.p>
                  )}
                  
                  {gameState.gamePhase === 'moving' && gameState.possibleMoves.length > 0 && (
                    <motion.p
                      key="moving"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-green-600 font-medium"
                    >
                      {currentPlayer.isAI ? 'AI is thinking...' : 'Select a pawn to move!'}
                    </motion.p>
                  )}
                  
                  {gameState.gamePhase === 'moving' && gameState.possibleMoves.length === 0 && (
                    <motion.p
                      key="no-moves"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-red-600 font-medium"
                    >
                      No valid moves!
                    </motion.p>
                  )}
                  
                  {gameState.gamePhase === 'finished' && (
                    <motion.p
                      key="finished"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-purple-600 font-bold text-lg"
                    >
                      🎉 {gameState.players.find(p => p.id === gameState.winner)?.name} Wins!
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Additional players (if any) */}
            {gameState.players.length > 2 && (
              <div className="space-y-4">
                {gameState.players.slice(2).map((player, originalIndex) => {
                  const index = originalIndex + 2;
                  return (
                    <PlayerPanel
                      key={player.id}
                      player={player}
                      isCurrentPlayer={index === gameState.currentPlayerIndex}
                      isWinner={player.isWinner}
                    />
                  );
                })}
              </div>
            )}

            {/* Game Instructions */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-xl border border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h4 className="font-bold text-gray-800 mb-3 text-lg">How to Play:</h4>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Roll 6 to move pawns out of base</li>
                <li>• Land on opponents to send them back</li>
                <li>• Safe zones (green dots) protect pawns</li>
                <li>• Get all 4 pawns home to win!</li>
                <li>• Roll 6 to get another turn</li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="lg:hidden mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gameState.players.map((player, index) => (
              <PlayerPanel
                key={player.id}
                player={player}
                isCurrentPlayer={index === gameState.currentPlayerIndex}
                isWinner={player.isWinner}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
