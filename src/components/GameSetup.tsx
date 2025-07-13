import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayerColor } from '../types/game';
import { Play, Bot, Users, Settings } from 'lucide-react';

interface GameSetupProps {
  onStartGame: (config: GameConfig) => void;
}

export interface GameConfig {
  mode: 'offline' | 'ai';
  playerCount: number;
  aiDifficulty: 'easy' | 'medium' | 'hard';
  playerNames: string[];
  playerColors: PlayerColor[];
}

const GameSetup: React.FC<GameSetupProps> = ({ onStartGame }) => {
  const [mode, setMode] = useState<'offline' | 'ai'>('ai');
  const [playerCount, setPlayerCount] = useState(2);
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2', 'Player 3', 'Player 4']);

  const colors: PlayerColor[] = ['red', 'blue', 'green', 'yellow'];

  const handleStartGame = () => {
    const config: GameConfig = {
      mode,
      playerCount,
      aiDifficulty,
      playerNames: playerNames.slice(0, playerCount),
      playerColors: colors.slice(0, playerCount)
    };
    onStartGame(config);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="text-center mb-8">
          <motion.h1
            className="text-4xl font-bold text-gray-800 mb-2"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎲 Ludo Game by Mubashir
          </motion.h1>
          <p className="text-gray-600">Choose your game settings</p>
        </div>

        <div className="space-y-6">
          {/* Game Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Settings className="inline w-4 h-4 mr-2" />
              Game Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                className={`p-3 rounded-lg border-2 flex items-center justify-center space-x-2 ${
                  mode === 'ai' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 text-gray-600'
                }`}
                onClick={() => setMode('ai')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Bot className="w-4 h-4" />
                <span className="text-sm font-medium">vs AI</span>
              </motion.button>
              <motion.button
                className={`p-3 rounded-lg border-2 flex items-center justify-center space-x-2 ${
                  mode === 'offline' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 text-gray-600'
                }`}
                onClick={() => setMode('offline')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Local</span>
              </motion.button>
            </div>
          </div>

          {/* Player Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Number of Players
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[2, 3, 4].map(count => (
                <motion.button
                  key={count}
                  className={`p-2 rounded-lg border-2 text-center ${
                    playerCount === count 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 text-gray-600'
                  }`}
                  onClick={() => setPlayerCount(count)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {count}
                </motion.button>
              ))}
            </div>
          </div>

          {/* AI Difficulty */}
          {mode === 'ai' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-3">
                AI Difficulty
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['easy', 'medium', 'hard'] as const).map(difficulty => (
                  <motion.button
                    key={difficulty}
                    className={`p-2 rounded-lg border-2 text-center text-sm ${
                      aiDifficulty === difficulty 
                        ? 'border-red-500 bg-red-50 text-red-700' 
                        : 'border-gray-300 text-gray-600'
                    }`}
                    onClick={() => setAiDifficulty(difficulty)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Player Names */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Player Names
            </label>
            <div className="space-y-2">
              {Array.from({ length: playerCount }).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  value={playerNames[index]}
                  onChange={(e) => {
                    const newNames = [...playerNames];
                    newNames[index] = e.target.value;
                    setPlayerNames(newNames);
                  }}
                  className={`w-full p-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    colors[index] === 'red' ? 'border-red-300' :
                    colors[index] === 'blue' ? 'border-blue-300' :
                    colors[index] === 'green' ? 'border-green-300' :
                    'border-yellow-300'
                  }`}
                  placeholder={`Player ${index + 1} (${colors[index]})`}
                />
              ))}
            </div>
          </div>

          {/* Start Game Button */}
          <motion.button
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-4 px-6 rounded-lg shadow-lg flex items-center justify-center space-x-2"
            onClick={handleStartGame}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-5 h-5" />
            <span>Start Game</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameSetup;
