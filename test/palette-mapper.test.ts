/**
 * Unit tests for GW2PaletteMapper
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GW2PaletteMapper } from '../src/palette-mapper.js';
import { Profession } from '../src/types.js';

// Mock fetch for testing
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe('GW2PaletteMapper', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  const mockGuardianResponse = {
    id: 'Guardian',
    name: 'Guardian',
    skills_by_palette: [
      [1, 12343], // paletteId 1 -> skillId 12343
      [2, 12417], // paletteId 2 -> skillId 12417
      [3, 12371], // paletteId 3 -> skillId 12371
      [999, null], // paletteId 999 -> no skill
    ],
  };

  it('should map palette index to skill ID', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGuardianResponse,
    });

    const mapper = new GW2PaletteMapper();
    const skillId = await mapper.paletteToSkill(1, 1); // Guardian, palette 1

    expect(skillId).toBe(12343);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.guildwars2.com/v2/professions/Guardian',
      expect.any(Object),
    );
  });

  it('should map skill ID to palette index', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGuardianResponse,
    });

    const mapper = new GW2PaletteMapper();
    const paletteIndex = await mapper.skillToPalette(1, 12343); // Guardian, skill 12343

    expect(paletteIndex).toBe(1);
  });

  it('should handle zero values without API call', async () => {
    const mapper = new GW2PaletteMapper();

    expect(await mapper.paletteToSkill(1, 0)).toBe(0);
    expect(await mapper.skillToPalette(1, 0)).toBe(0);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should cache API responses', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGuardianResponse,
    });

    const mapper = new GW2PaletteMapper();

    // First call should fetch from API
    await mapper.paletteToSkill(1, 1);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Second call should use cache
    await mapper.paletteToSkill(1, 2);
    expect(mockFetch).toHaveBeenCalledTimes(1); // Still 1, not 2
  });

  it('should throw on unmapped palette index', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGuardianResponse,
    });

    const mapper = new GW2PaletteMapper();

    await expect(mapper.paletteToSkill(1, 99999)).rejects.toThrow(
      /No skill mapping for palette 99999/,
    );
  });

  it('should throw on unmapped skill ID', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGuardianResponse,
    });

    const mapper = new GW2PaletteMapper();

    await expect(mapper.skillToPalette(1, 99999)).rejects.toThrow(
      /No palette mapping for skill 99999/,
    );
  });

  it('should clear cache', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockGuardianResponse,
    });

    const mapper = new GW2PaletteMapper();

    // First fetch
    await mapper.paletteToSkill(1, 1);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Clear cache
    mapper.clearCache(1);

    // Should fetch again
    await mapper.paletteToSkill(1, 1);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should clear all caches', async () => {
    const mockWarriorResponse = {
      id: 'Warrior',
      name: 'Warrior',
      skills_by_palette: [
        [1, 14401], // paletteId 1 -> skillId 14401
        [2, 14405], // paletteId 2 -> skillId 14405
      ],
    };

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockGuardianResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockWarriorResponse,
      });

    const mapper = new GW2PaletteMapper();

    // Fetch Guardian and Warrior
    await mapper.paletteToSkill(1, 1);
    await mapper.paletteToSkill(2, 1);
    expect(mockFetch).toHaveBeenCalledTimes(2);

    // Clear all
    mapper.clearCache();

    // Should fetch both again
    mockFetch.mockClear();
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockGuardianResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockWarriorResponse,
      });

    await mapper.paletteToSkill(1, 1);
    await mapper.paletteToSkill(2, 1);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should handle API errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const mapper = new GW2PaletteMapper();

    await expect(mapper.paletteToSkill(1, 1)).rejects.toThrow(/GW2 API error/);
  });

  it('should use custom API URL', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGuardianResponse,
    });

    const mapper = new GW2PaletteMapper({
      apiUrl: 'https://custom-api.example.com',
    });

    await mapper.paletteToSkill(1, 1);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://custom-api.example.com/v2/professions/Guardian',
      expect.any(Object),
    );
  });

  it('should handle round-trip mapping', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGuardianResponse,
    });

    const mapper = new GW2PaletteMapper();

    const skillId = 12343;
    const paletteIndex = await mapper.skillToPalette(1, skillId);
    const roundTripSkillId = await mapper.paletteToSkill(1, paletteIndex);

    expect(roundTripSkillId).toBe(skillId);
  });
});
