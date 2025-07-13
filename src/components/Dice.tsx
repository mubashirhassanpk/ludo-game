import React from 'react';
import { motion } from 'framer-motion';

interface DiceProps {
  value: number;
  isRolling: boolean;
  onRoll: () => void;
  disabled: boolean;
}

const Dice: React.FC<DiceProps> = ({ value, isRolling, onRoll, disabled }) => {
  const diceContainerVariants = {
    rolling: {
      rotate: [0, 180, 360],
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    },
    idle: {
      rotate: 0,
      scale: 1
    }
  };

  const getDotPositions = (num: number) => {
    const positions = {
      1: [[2, 2]],
      2: [[1, 1], [3, 3]],
      3: [[1, 1], [2, 2], [3, 3]],
      4: [[1, 1], [1, 3], [3, 1], [3, 3]],
      5: [[1, 1], [1, 3], [2, 2], [3, 1], [3, 3]],
      6: [[1, 1], [1, 2], [1, 3], [3, 1], [3, 2], [3, 3]]
    };
    return positions[num as keyof typeof positions] || [];
  };

  return (
    <motion.button
      className={`w-20 h-20 bg-white border-4 border-gray-700 rounded-lg shadow-xl relative grid grid-cols-3 grid-rows-3 gap-1 p-2 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl cursor-pointer hover:border-gray-800'
      }`}
      variants={diceContainerVariants}
      animate={isRolling ? "rolling" : "idle"}
      onClick={onRoll}
      disabled={disabled || isRolling}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {getDotPositions(value).map(([row, col], index) => (
        <motion.div
          key={index}
          className="w-2.5 h-2.5 bg-gray-800 rounded-full"
          style={{
            gridColumn: col,
            gridRow: row
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
        />
      ))}
    </motion.button>
  );
};

export default Dice;
