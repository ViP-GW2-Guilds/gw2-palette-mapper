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
  /** Array of [paletteId, skillId] pairs */
  skills_by_palette: Array<[number, number | null]>;
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
 * GW2 API skill response structure
 */
export interface GW2ApiSkill {
  /** Skill ID */
  id: number;
  /** Skill name */
  name: string;
  /** Professions that can use this skill */
  professions: string[];
  /** Skill type */
  type: string;
  /** Skill slot */
  slot: string;
  /** Other fields */
  [key: string]: unknown;
}

/**
 * GW2 API specialization response structure
 */
export interface GW2ApiSpecialization {
  /** Specialization ID */
  id: number;
  /** Specialization name */
  name: string;
  /** Profession that owns this specialization */
  profession: string;
  /** Whether this is an elite specialization */
  elite: boolean;
  /** Other fields */
  [key: string]: unknown;
}

/**
 * GW2 API pet response structure
 */
export interface GW2ApiPet {
  /** Pet ID */
  id: number;
  /** Pet name */
  name: string;
  /** Other fields */
  [key: string]: unknown;
}

/**
 * Re-export Profession for convenience
 */
export type Profession = ProfessionType;
