import React from 'react';
import { motion } from 'framer-motion';
import { Player } from '../types/game';
import { Crown, Bot, User } from 'lucide-react';

interface PlayerPanelProps {
  player: Player;
  isCurrentPlayer: boolean;
  isWinner: boolean;
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({ 
  player, 
  isCurrentPlayer, 
  isWinner 
}) => {
  const colorClasses = {
    red: 'border-red-400 bg-red-50',
    blue: 'border-blue-400 bg-blue-50',
    green: 'border-green-400 bg-green-50',
    yellow: 'border-yellow-400 bg-yellow-50'
  };

  const textColorClasses = {
    red: 'text-red-700',
    blue: 'text-blue-700',
    green: 'text-green-700',
    yellow: 'text-yellow-700'
  };

  const pawnsInHome = player.pawns.filter(p => p.isInHome).length;
  const pawnsInBase = player.pawns.filter(p => p.isInBase).length;
  const pawnsOnBoard = 4 - pawnsInHome - pawnsInBase;

  return (
    <motion.div
      className={`border-2 rounded-xl p-4 ${colorClasses[player.color]} ${
        isCurrentPlayer ? 'ring-2 ring-green-400' : ''
      }`}
      animate={{
        scale: isCurrentPlayer ? 1.02 : 1,
        boxShadow: isCurrentPlayer 
          ? '0 8px 25px rgba(0, 0, 0, 0.15)' 
          : '0 4px 6px rgba(0, 0, 0, 0.07)'
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {player.isAI ? (
            <Bot className={`w-5 h-5 ${textColorClasses[player.color]}`} />
          ) : (
            <User className={`w-5 h-5 ${textColorClasses[player.color]}`} />
          )}
          <h3 className={`font-bold text-lg ${textColorClasses[player.color]}`}>
            {player.name}
          </h3>
          {isWinner && (
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
            >
              <Crown className="w-6 h-6 text-yellow-500" />
            </motion.div>
          )}
        </div>
        
        {isCurrentPlayer && (
          <motion.div
            className="w-4 h-4 bg-green-500 rounded-full"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>In Home:</span>
          <span className="font-semibold">{pawnsInHome}/4</span>
        </div>
        <div className="flex justify-between">
          <span>On Board:</span>
          <span className="font-semibold">{pawnsOnBoard}</span>
        </div>
        <div className="flex justify-between">
          <span>In Base:</span>
          <span className="font-semibold">{pawnsInBase}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="text-xs text-gray-600 mb-1 text-center">
          Progress: {Math.round((pawnsInHome / 4) * 100)}%
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${
              player.color === 'red' ? 'bg-red-500' :
              player.color === 'blue' ? 'bg-blue-500' :
              player.color === 'green' ? 'bg-green-500' :
              'bg-yellow-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${(pawnsInHome / 4) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerPanel;
