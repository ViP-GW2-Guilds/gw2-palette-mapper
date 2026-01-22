/**
 * GW2 API client for fetching profession data
 */

import type { Profession } from '@vip-gw2-guilds/gw2-build-decoder';
import type {
  GW2ApiProfession,
  GW2ApiSkill,
  GW2ApiSpecialization,
  GW2ApiPet,
  PaletteMapperOptions,
} from './types.js';
import { PROFESSION_NAMES } from './constants.js';

/**
 * Client for interacting with the GW2 official API
 */
export class GW2ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(options: Required<PaletteMapperOptions>) {
    this.baseUrl = options.apiUrl;
    this.timeout = options.timeout;
  }

  /**
   * Fetch profession data from GW2 API
   * @param profession - The profession to fetch
   * @returns Promise resolving to profession data including skills_by_palette
   * @throws Error if API request fails or times out
   */
  async fetchProfession(profession: Profession): Promise<GW2ApiProfession> {
    const professionName = PROFESSION_NAMES[profession];
    if (!professionName) {
      throw new Error(`Unknown profession: ${profession}`);
    }

    const url = `${this.baseUrl}/v2/professions/${professionName}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'X-Schema-Version': '2019-12-19T00:00:00.000Z',
        },
      });

      if (!response.ok) {
        throw new Error(
          `GW2 API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = (await response.json()) as GW2ApiProfession;

      // Validate response has required field
      if (!Array.isArray(data.skills_by_palette)) {
        throw new Error(
          `Invalid API response: missing skills_by_palette array`,
        );
      }

      return data;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`GW2 API request timeout after ${this.timeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Fetch skill data from GW2 API
   * @param skillId - The skill ID to fetch
   * @returns Promise resolving to skill data
   * @throws Error if API request fails or times out
   */
  async fetchSkill(skillId: number): Promise<GW2ApiSkill> {
    const url = `${this.baseUrl}/v2/skills/${skillId}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `GW2 API error: ${response.status} ${response.statusText}`,
        );
      }

      return (await response.json()) as GW2ApiSkill;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`GW2 API request timeout after ${this.timeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Fetch specialization data from GW2 API
   * @param specId - The specialization ID to fetch
   * @returns Promise resolving to specialization data
   * @throws Error if API request fails or times out
   */
  async fetchSpecialization(specId: number): Promise<GW2ApiSpecialization> {
    const url = `${this.baseUrl}/v2/specializations/${specId}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `GW2 API error: ${response.status} ${response.statusText}`,
        );
      }

      return (await response.json()) as GW2ApiSpecialization;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`GW2 API request timeout after ${this.timeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Fetch pet data from GW2 API
   * @param petId - The pet ID to fetch
   * @returns Promise resolving to pet data
   * @throws Error if API request fails or times out
   */
  async fetchPet(petId: number): Promise<GW2ApiPet> {
    const url = `${this.baseUrl}/v2/pets/${petId}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `GW2 API error: ${response.status} ${response.statusText}`,
        );
      }

      return (await response.json()) as GW2ApiPet;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`GW2 API request timeout after ${this.timeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
