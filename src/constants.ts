/**
 * Constants for GW2 palette mapping
 */

export const PROFESSION_NAMES: Record<number, string> = {
  1: 'Guardian',
  2: 'Warrior',
  3: 'Engineer',
  4: 'Ranger',
  5: 'Thief',
  6: 'Elementalist',
  7: 'Mesmer',
  8: 'Necromancer',
  9: 'Revenant',
};

export const DEFAULT_API_URL = 'https://api.guildwars2.com';
export const DEFAULT_CACHE_TTL = 30 * 60 * 1000; // 30 minutes
export const DEFAULT_TIMEOUT = 5000; // 5 seconds
