import React from 'react';
import { motion } from 'framer-motion';
import { Pawn as PawnType, PlayerColor } from '../types/game';

interface PawnProps {
  pawn: PawnType;
  position: { x: number; y: number };
  color: PlayerColor;
  isSelected: boolean;
  isMoveable: boolean;
  onClick: () => void;
}

const Pawn: React.FC<PawnProps> = ({ 
  pawn, 
  position, 
  color, 
  isSelected, 
  isMoveable, 
  onClick 
}) => {
  const colorClasses = {
    red: 'bg-red-500 border-red-700 shadow-red-200',
    blue: 'bg-blue-500 border-blue-700 shadow-blue-200',
    green: 'bg-green-500 border-green-700 shadow-green-200',
    yellow: 'bg-yellow-500 border-yellow-700 shadow-yellow-200'
  };

  return (
    <motion.div
      className={`absolute w-7 h-7 rounded-full border-3 cursor-pointer z-10 shadow-lg
        ${colorClasses[color]}
        ${isSelected ? 'ring-4 ring-white ring-opacity-90' : ''}
        ${isMoveable ? 'hover:scale-110' : ''}
        ${pawn.isSafe ? 'ring-2 ring-green-400' : ''}
      `}
      style={{
        left: position.x - 14,
        top: position.y - 14
      }}
      onClick={onClick}
      animate={{
        x: position.x - 14,
        y: position.y - 14,
        scale: isSelected ? 1.3 : 1
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      whileHover={isMoveable ? { scale: 1.15 } : {}}
      whileTap={isMoveable ? { scale: 0.9 } : {}}
    >
      {/* Inner highlight for better visibility */}
      <div className="absolute inset-1 bg-white rounded-full opacity-70" />
      
      {/* Safe zone indicator */}
      {pawn.isSafe && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

export default Pawn;
