/**
 * Type definitions for GW2 palette mapping
 */

import type { Profession as ProfessionType } from '@vip-gw2-guilds/gw2-build-decoder';

/**
 * Bidirectional palette mapping data
 */
export interface PaletteData {
  /** Map from palette index to skill ID */
  paletteToSkill: Map<number, number>;
  /** Map from skill ID to palette index */
  skillToPalette: Map<number, number>;
}

/**
 * GW2 API profession response structure
 */
export interface GW2ApiProfession {
  /** Profession internal ID */
  id: string;
  /** Profession display name */
  name: string;
  /** Array of skill IDs indexed by palette ID (null for unused indices) */
  skills_by_palette: Array<number | null>;
  /** Other fields we don't use */
  [key: string]: unknown;
}

/**
 * Configuration options for GW2PaletteMapper
 */
export interface PaletteMapperOptions {
  /** API base URL (default: https://api.guildwars2.com) */
  apiUrl?: string;
  /** Cache TTL in milliseconds (default: 30 minutes) */
  cacheTtl?: number;
  /** Timeout for API requests in milliseconds (default: 5000) */
  timeout?: number;
}

/**
 * Re-export Profession for convenience
 */
export type Profession = ProfessionType;
