import React from 'react';
import { motion } from 'framer-motion';
import { Player } from '../types/game';
import { getBoardPosition, getBasePosition, getHomePosition } from '../utils/boardPositions';
import Pawn from './Pawn';

interface BoardProps {
  players: Player[];
  selectedPawn: string | null;
  possibleMoves: string[];
  onPawnClick: (pawnId: string) => void;
}

const Board: React.FC<BoardProps> = ({ 
  players, 
  selectedPawn, 
  possibleMoves, 
  onPawnClick 
}) => {
  const boardSize = 600;
  const cellSize = boardSize / 15;

  const renderBoardGrid = () => {
    const cells = [];
    
    // Create the 15x15 grid
    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 15; col++) {
        let cellClass = 'absolute border border-gray-400';
        
        // Define regions based on the reference image
        const isRedBase = row >= 1 && row <= 5 && col >= 1 && col <= 5;
        const isGreenBase = row >= 1 && row <= 5 && col >= 9 && col <= 13;
        const isYellowBase = row >= 9 && row <= 13 && col >= 1 && col <= 5;
        const isBlueBase = row >= 9 && row <= 13 && col >= 9 && col <= 13;
        
        // Home paths
        const isRedHome = row >= 1 && row <= 6 && col === 7;
        const isGreenHome = row >= 8 && row <= 13 && col === 7;
        const isYellowHome = row === 7 && col >= 1 && col <= 6;
        const isBlueHome = row === 7 && col >= 8 && col <= 13;
        
        // Main track cells
        const isTrack = 
          (row === 6 && (col <= 5 || col >= 9)) ||
          (row === 8 && (col <= 5 || col >= 9)) ||
          (col === 6 && (row <= 5 || row >= 9)) ||
          (col === 8 && (row <= 5 || row >= 9));
        
        const isCenter = row === 7 && col === 7;
        
        // Apply colors matching the reference image
        if (isRedBase) {
          cellClass += ' bg-red-200 border-red-300';
        } else if (isGreenBase) {
          cellClass += ' bg-green-200 border-green-300';
        } else if (isYellowBase) {
          cellClass += ' bg-yellow-200 border-yellow-300';
        } else if (isBlueBase) {
          cellClass += ' bg-blue-200 border-blue-300';
        } else if (isRedHome) {
          cellClass += ' bg-red-400 border-red-500';
        } else if (isGreenHome) {
          cellClass += ' bg-green-400 border-green-500';
        } else if (isYellowHome) {
          cellClass += ' bg-yellow-400 border-yellow-500';
        } else if (isBlueHome) {
          cellClass += ' bg-blue-400 border-blue-500';
        } else if (isTrack) {
          cellClass += ' bg-white border-gray-500';
        } else if (isCenter) {
          cellClass += ' bg-white border-gray-600';
        } else {
          cellClass += ' bg-gray-100 border-gray-300';
        }

        cells.push(
          <div
            key={`${row}-${col}`}
            className={cellClass}
            style={{
              left: col * cellSize,
              top: row * cellSize,
              width: cellSize,
              height: cellSize
            }}
          />
        );
      }
    }
    
    return cells;
  };

  const renderSafeZones = () => {
    const safePositions = [0, 8, 13, 21, 26, 34, 39, 47];
    return safePositions.map(pos => {
      const position = getBoardPosition(pos);
      return (
        <div
          key={`safe-${pos}`}
          className="absolute w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
          style={{
            left: position.x - 12,
            top: position.y - 12,
            zIndex: 5
          }}
        >
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
      );
    });
  };

  const renderStartingPositions = () => {
    const starts = [
      { pos: 0, color: 'red' },
      { pos: 13, color: 'blue' },
      { pos: 26, color: 'green' },
      { pos: 39, color: 'yellow' }
    ];
    
    return starts.map(start => {
      const position = getBoardPosition(start.pos);
      return (
        <div
          key={`start-${start.color}`}
          className={`absolute w-8 h-8 rounded-full border-3 ${
            start.color === 'red' ? 'border-red-600 bg-red-300' :
            start.color === 'blue' ? 'border-blue-600 bg-blue-300' :
            start.color === 'green' ? 'border-green-600 bg-green-300' :
            'border-yellow-600 bg-yellow-300'
          }`}
          style={{
            left: position.x - 16,
            top: position.y - 16,
            zIndex: 3
          }}
        />
      );
    });
  };

  const renderPawns = () => {
    const pawns: JSX.Element[] = [];

    players.forEach(player => {
      player.pawns.forEach((pawn, index) => {
        let position;
        
        if (pawn.isInBase) {
          position = getBasePosition(player.color, index);
        } else if (pawn.position >= 52) {
          const homeStep = pawn.position - 52;
          position = getHomePosition(player.color, homeStep);
        } else {
          position = getBoardPosition(pawn.position);
        }

        pawns.push(
          <Pawn
            key={pawn.id}
            pawn={pawn}
            position={position}
            color={player.color}
            isSelected={selectedPawn === pawn.id}
            isMoveable={possibleMoves.includes(pawn.id)}
            onClick={() => onPawnClick(pawn.id)}
          />
        );
      });
    });

    return pawns;
  };

  return (
    <motion.div
      className="relative bg-white border-4 border-gray-600 rounded-xl shadow-2xl"
      style={{ width: boardSize, height: boardSize }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {renderBoardGrid()}
      {renderSafeZones()}
      {renderStartingPositions()}
      {renderPawns()}
      
      {/* Center triangle */}
      <div 
        className="absolute bg-white border-4 border-gray-600 flex items-center justify-center"
        style={{
          left: 7 * cellSize,
          top: 7 * cellSize,
          width: cellSize,
          height: cellSize,
          zIndex: 4,
          clipPath: 'polygon(50% 20%, 20% 80%, 80% 80%)'
        }}
      >
      </div>
    </motion.div>
  );
};

export default Board;
