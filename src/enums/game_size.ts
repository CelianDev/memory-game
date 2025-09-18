export type GameSize = 'Small' | 'Medium' | 'Large';

export const GAME_SIZE_VALUES = {
  Small: 1,
  Medium: 2,
  Large: 3,
} as const satisfies Record<GameSize, number>;