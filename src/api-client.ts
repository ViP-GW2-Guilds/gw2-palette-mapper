/**
 * GW2 API client for fetching profession data
 */

import type { Profession } from '@vip-gw2-guilds/gw2-build-decoder';
import type { GW2ApiProfession, PaletteMapperOptions } from './types.js';
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
}
