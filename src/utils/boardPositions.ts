import { Position } from '../types/game';

const BOARD_SIZE = 600;
const CELL_SIZE = BOARD_SIZE / 15;

// Define the track positions going clockwise around the board
const TRACK_POSITIONS: Position[] = [
  // Bottom row - positions 0-5 (Red starting area)
  { x: 6 * CELL_SIZE, y: 8 * CELL_SIZE },  // Position 0 - Red start
  { x: 7 * CELL_SIZE, y: 8 * CELL_SIZE },  // Position 1
  { x: 8 * CELL_SIZE, y: 8 * CELL_SIZE },  // Position 2
  { x: 9 * CELL_SIZE, y: 8 * CELL_SIZE },  // Position 3
  { x: 10 * CELL_SIZE, y: 8 * CELL_SIZE }, // Position 4
  { x: 11 * CELL_SIZE, y: 8 * CELL_SIZE }, // Position 5

  // Right column going up - positions 6-11
  { x: 12 * CELL_SIZE, y: 9 * CELL_SIZE },  // Position 6
  { x: 12 * CELL_SIZE, y: 10 * CELL_SIZE }, // Position 7
  { x: 12 * CELL_SIZE, y: 11 * CELL_SIZE }, // Position 8
  { x: 12 * CELL_SIZE, y: 12 * CELL_SIZE }, // Position 9
  { x: 12 * CELL_SIZE, y: 13 * CELL_SIZE }, // Position 10
  { x: 12 * CELL_SIZE, y: 14 * CELL_SIZE }, // Position 11

  // Top row going right - positions 12-17 (Blue starting area)
  { x: 11 * CELL_SIZE, y: 14 * CELL_SIZE }, // Position 12
  { x: 10 * CELL_SIZE, y: 14 * CELL_SIZE }, // Position 13 - Blue start
  { x: 9 * CELL_SIZE, y: 14 * CELL_SIZE },  // Position 14
  { x: 8 * CELL_SIZE, y: 14 * CELL_SIZE },  // Position 15
  { x: 7 * CELL_SIZE, y: 14 * CELL_SIZE },  // Position 16
  { x: 6 * CELL_SIZE, y: 14 * CELL_SIZE },  // Position 17

  // Left column going up - positions 18-23
  { x: 5 * CELL_SIZE, y: 13 * CELL_SIZE },  // Position 18
  { x: 5 * CELL_SIZE, y: 12 * CELL_SIZE },  // Position 19
  { x: 5 * CELL_SIZE, y: 11 * CELL_SIZE },  // Position 20
  { x: 5 * CELL_SIZE, y: 10 * CELL_SIZE },  // Position 21
  { x: 5 * CELL_SIZE, y: 9 * CELL_SIZE },   // Position 22
  { x: 5 * CELL_SIZE, y: 8 * CELL_SIZE },   // Position 23

  // Top row going right - positions 24-29 (Green starting area)
  { x: 6 * CELL_SIZE, y: 6 * CELL_SIZE },   // Position 24
  { x: 7 * CELL_SIZE, y: 6 * CELL_SIZE },   // Position 25
  { x: 8 * CELL_SIZE, y: 6 * CELL_SIZE },   // Position 26 - Green start
  { x: 9 * CELL_SIZE, y: 6 * CELL_SIZE },   // Position 27
  { x: 10 * CELL_SIZE, y: 6 * CELL_SIZE },  // Position 28
  { x: 11 * CELL_SIZE, y: 6 * CELL_SIZE },  // Position 29

  // Right column going down - positions 30-35
  { x: 12 * CELL_SIZE, y: 5 * CELL_SIZE },  // Position 30
  { x: 12 * CELL_SIZE, y: 4 * CELL_SIZE },  // Position 31
  { x: 12 * CELL_SIZE, y: 3 * CELL_SIZE },  // Position 32
  { x: 12 * CELL_SIZE, y: 2 * CELL_SIZE },  // Position 33
  { x: 12 * CELL_SIZE, y: 1 * CELL_SIZE },  // Position 34
  { x: 12 * CELL_SIZE, y: 0 * CELL_SIZE },  // Position 35

  // Top row going left - positions 36-41 (Yellow starting area)
  { x: 11 * CELL_SIZE, y: 0 * CELL_SIZE },  // Position 36
  { x: 10 * CELL_SIZE, y: 0 * CELL_SIZE },  // Position 37
  { x: 9 * CELL_SIZE, y: 0 * CELL_SIZE },   // Position 38
  { x: 8 * CELL_SIZE, y: 0 * CELL_SIZE },   // Position 39 - Yellow start
  { x: 7 * CELL_SIZE, y: 0 * CELL_SIZE },   // Position 40
  { x: 6 * CELL_SIZE, y: 0 * CELL_SIZE },   // Position 41

  // Left column going down - positions 42-47
  { x: 5 * CELL_SIZE, y: 1 * CELL_SIZE },   // Position 42
  { x: 5 * CELL_SIZE, y: 2 * CELL_SIZE },   // Position 43
  { x: 5 * CELL_SIZE, y: 3 * CELL_SIZE },   // Position 44
  { x: 5 * CELL_SIZE, y: 4 * CELL_SIZE },   // Position 45
  { x: 5 * CELL_SIZE, y: 5 * CELL_SIZE },   // Position 46
  { x: 5 * CELL_SIZE, y: 6 * CELL_SIZE },   // Position 47

  // Final stretch to complete the loop - positions 48-51
  { x: 6 * CELL_SIZE, y: 7 * CELL_SIZE },   // Position 48
  { x: 7 * CELL_SIZE, y: 7 * CELL_SIZE },   // Position 49
  { x: 8 * CELL_SIZE, y: 7 * CELL_SIZE },   // Position 50
  { x: 9 * CELL_SIZE, y: 7 * CELL_SIZE },   // Position 51
];

export function getBoardPosition(position: number): Position {
  if (position >= 0 && position < TRACK_POSITIONS.length) {
    return TRACK_POSITIONS[position];
  }
  return { x: 0, y: 0 };
}

export function getBasePosition(color: string, pawnIndex: number): Position {
  const basePositions = {
    red: { x: 1.5 * CELL_SIZE, y: 1.5 * CELL_SIZE },
    blue: { x: 10.5 * CELL_SIZE, y: 10.5 * CELL_SIZE },
    green: { x: 10.5 * CELL_SIZE, y: 1.5 * CELL_SIZE },
    yellow: { x: 1.5 * CELL_SIZE, y: 10.5 * CELL_SIZE }
  };
  
  const base = basePositions[color as keyof typeof basePositions];
  const offsets = [
    { x: 0, y: 0 },
    { x: CELL_SIZE * 1.5, y: 0 },
    { x: 0, y: CELL_SIZE * 1.5 },
    { x: CELL_SIZE * 1.5, y: CELL_SIZE * 1.5 }
  ];
  
  return {
    x: base.x + offsets[pawnIndex].x,
    y: base.y + offsets[pawnIndex].y
  };
}

export function getHomePosition(color: string, step: number): Position {
  const homeStarts = {
    red: { x: 7 * CELL_SIZE, y: 7 * CELL_SIZE },
    blue: { x: 8 * CELL_SIZE, y: 13 * CELL_SIZE },
    green: { x: 8 * CELL_SIZE, y: 1 * CELL_SIZE },
    yellow: { x: 1 * CELL_SIZE, y: 7 * CELL_SIZE }
  };
  
  const directions = {
    red: { x: 0, y: -1 },
    blue: { x: 0, y: -1 },
    green: { x: 0, y: 1 },
    yellow: { x: 1, y: 0 }
  };
  
  const start = homeStarts[color as keyof typeof homeStarts];
  const dir = directions[color as keyof typeof directions];
  
  return {
    x: start.x + dir.x * step * CELL_SIZE,
    y: start.y + dir.y * step * CELL_SIZE
  };
}
