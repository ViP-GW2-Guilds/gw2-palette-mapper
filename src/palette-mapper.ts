/**
 * Main GW2PaletteMapper implementation
 */

import type {
  PaletteMapper,
  Profession,
} from '@vip-gw2-guilds/gw2-build-decoder';
import { GW2ApiClient } from './api-client.js';
import type {
  PaletteData,
  PaletteMapperOptions,
  GW2ApiProfession,
} from './types.js';
import {
  DEFAULT_API_URL,
  DEFAULT_CACHE_TTL,
  DEFAULT_TIMEOUT,
} from './constants.js';

/**
 * Palette mapper implementation using GW2 official API
 *
 * Fetches palette mapping data from the GW2 API and caches it in memory.
 * Provides bidirectional conversion between palette indices and skill IDs.
 */
export class GW2PaletteMapper implements PaletteMapper {
  private cache: Map<Profession, { data: PaletteData; timestamp: number }>;
  private apiClient: GW2ApiClient;
  private options: Required<PaletteMapperOptions>;

  /**
   * Create a new GW2PaletteMapper
   * @param options - Configuration options
   */
  constructor(options?: PaletteMapperOptions) {
    this.cache = new Map();
    this.options = {
      apiUrl: options?.apiUrl ?? DEFAULT_API_URL,
      cacheTtl: options?.cacheTtl ?? DEFAULT_CACHE_TTL,
      timeout: options?.timeout ?? DEFAULT_TIMEOUT,
    };
    this.apiClient = new GW2ApiClient(this.options);
  }

  /**
   * Convert a palette index to a skill ID
   * @param profession - The character profession
   * @param paletteIndex - The palette index from the build code
   * @returns Promise resolving to the corresponding skill ID
   * @throws Error if palette index is not mapped
   */
  async paletteToSkill(
    profession: Profession,
    paletteIndex: number,
  ): Promise<number> {
    if (paletteIndex === 0) return 0;

    const data = await this.getPaletteData(profession);

    const skillId = data.paletteToSkill.get(paletteIndex);
    if (skillId === undefined) {
      throw new Error(
        `No skill mapping for palette ${paletteIndex} (Profession ${profession})`,
      );
    }

    return skillId;
  }

  /**
   * Convert a skill ID to a palette index
   * @param profession - The character profession
   * @param skillId - The skill ID to encode
   * @returns Promise resolving to the corresponding palette index
   * @throws Error if skill ID is not mapped
   */
  async skillToPalette(
    profession: Profession,
    skillId: number,
  ): Promise<number> {
    if (skillId === 0) return 0;

    const data = await this.getPaletteData(profession);

    const paletteIndex = data.skillToPalette.get(skillId);
    if (paletteIndex === undefined) {
      throw new Error(
        `No palette mapping for skill ${skillId} (Profession ${profession})`,
      );
    }

    return paletteIndex;
  }

  /**
   * Clear cache for a profession or all professions
   * @param profession - Optional profession to clear (if undefined, clears all)
   */
  clearCache(profession?: Profession): void {
    if (profession !== undefined) {
      this.cache.delete(profession);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get skill information from GW2 API (for validation)
   * @param skillId - The skill ID to look up
   * @returns Promise resolving to skill info, or null if not found
   */
  async getSkillInfo(
    skillId: number,
  ): Promise<{ id: number; name: string; professions: string[]; type: string; slot: string } | null> {
    try {
      const data = await this.apiClient.fetchSkill(skillId);
      return {
        id: data.id,
        name: data.name,
        professions: data.professions,
        type: data.type,
        slot: data.slot,
      };
    } catch (error) {
      // Skill doesn't exist or API error
      return null;
    }
  }

  /**
   * Get specialization information from GW2 API (for validation)
   * @param specId - The specialization ID to look up
   * @returns Promise resolving to specialization info, or null if not found
   */
  async getSpecializationInfo(
    specId: number,
  ): Promise<{ id: number; name: string; profession: string; elite: boolean } | null> {
    try {
      const data = await this.apiClient.fetchSpecialization(specId);
      return {
        id: data.id,
        name: data.name,
        profession: data.profession,
        elite: data.elite,
      };
    } catch (error) {
      // Specialization doesn't exist or API error
      return null;
    }
  }

  /**
   * Get pet information from GW2 API (for validation)
   * @param petId - The pet ID to look up
   * @returns Promise resolving to pet info, or null if not found
   */
  async getPetInfo(
    petId: number,
  ): Promise<{ id: number; name: string } | null> {
    try {
      const data = await this.apiClient.fetchPet(petId);
      return {
        id: data.id,
        name: data.name,
      };
    } catch (error) {
      // Pet doesn't exist or API error
      return null;
    }
  }

  /**
   * Get palette data for a profession (from cache or API)
   */
  private async getPaletteData(profession: Profession): Promise<PaletteData> {
    // Check cache
    const cached = this.cache.get(profession);
    if (cached && Date.now() - cached.timestamp < this.options.cacheTtl) {
      return cached.data;
    }

    // Fetch from API
    const apiData = await this.apiClient.fetchProfession(profession);
    const data = this.buildPaletteData(apiData);

    // Cache result
    this.cache.set(profession, { data, timestamp: Date.now() });

    return data;
  }

  /**
   * Build bidirectional palette mapping from API response
   */
  private buildPaletteData(apiData: GW2ApiProfession): PaletteData {
    const paletteToSkill = new Map<number, number>();
    const skillToPalette = new Map<number, number>();

    // Build mappings from API data
    // skills_by_palette is an array of [paletteId, skillId] pairs
    apiData.skills_by_palette.forEach(([paletteId, skillId]) => {
      if (skillId !== null && skillId !== 0) {
        paletteToSkill.set(paletteId, skillId);
        skillToPalette.set(skillId, paletteId);
      }
    });

    return { paletteToSkill, skillToPalette };
  }
}
