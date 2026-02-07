/**
 * Hardcoded Revenant legend-specific skill-to-palette mappings
 *
 * The GW2 API does not include palette mappings for classic Revenant legends (1-7).
 * All legends share the same palette indices for the same skill slot:
 * - Palette 4572: ALL legend heal skills
 * - Palette 4564: ALL legend utility1 skills
 * - Palette 4614: ALL legend utility2 skills
 * - Palette 4651: ALL legend utility3 skills
 * - Palette 4554: ALL legend elite skills
 *
 * The legend ID is required to determine which specific skill a palette index represents.
 *
 * Legend code mapping:
 * - 1: Glint (Legendary Dragon Stance)
 * - 2: Shiro (Legendary Assassin Stance)
 * - 3: Jalis (Legendary Dwarf Stance)
 * - 4: Mallyx (Legendary Demon Stance)
 * - 5: Kalla (Legendary Renegade Stance)
 * - 6: Ventari (Legendary Centaur Stance)
 * - 7: Vindicator (Legendary Alliance Stance)
 *
 * @see https://api.guildwars2.com/v2/legends for official legend data
 * @remarks These mappings were reverse-engineered from in-game build codes
 */

/**
 * Map from palette index to legend-specific skills
 * Key: palette index, Value: Map of legend code to skill ID
 */
export const REVENANT_PALETTE_TO_SKILL: Map<number, Map<number, number>> =
  new Map([
    // Palette 4572: Heal skills
    [
      4572,
      new Map([
        [1, 27220], // Glint: Facet of Light
        [2, 26937], // Shiro: Enchanted Daggers
        [3, 28219], // Jalis: Soothing Stone
        [4, 27372], // Mallyx: Empowering Misery
        [5, 28427], // Kalla: Breakrazor's Bastion
        [6, 45686], // Ventari: Project Tranquility
        [7, 62719], // Vindicator: Battle Dance
      ]),
    ],
    // Palette 4564: Utility1 skills
    [
      4564,
      new Map([
        [1, 28379], // Glint: Facet of Darkness
        [2, 29209], // Shiro: Riposting Shadows
        [3, 27322], // Jalis: Vengeful Hammers
        [4, 28516], // Mallyx: Pain Absorption
        [5, 26821], // Kalla: Darkrazor's Daring
        [6, 42949], // Ventari: Protective Solace
        [7, 62832], // Vindicator: Urn of Saint Viktor
      ]),
    ],
    // Palette 4614: Utility2 skills
    [
      4614,
      new Map([
        [1, 27014], // Glint: Facet of Elements
        [2, 28231], // Shiro: Phase Traversal
        [3, 27505], // Jalis: Inspiring Reinforcement
        [4, 26679], // Mallyx: Call to Anguish
        [5, 27025], // Kalla: Razorclaw's Rage
        [6, 40485], // Ventari: Natural Harmony
        [7, 62962], // Vindicator: Forerunner of Death
      ]),
    ],
    // Palette 4651: Utility3 skills
    [
      4651,
      new Map([
        [1, 26644], // Glint: Facet of Strength
        [2, 27107], // Shiro: Impossible Odds
        [3, 27917], // Jalis: Forced Engagement
        [4, 26557], // Mallyx: Banish Enchantment
        [5, 27715], // Kalla: Icerazor's Ire
        [6, 41220], // Ventari: Purifying Essence
        [7, 62878], // Vindicator: Death Drop
      ]),
    ],
    // Palette 4554: Elite skills
    [
      4554,
      new Map([
        [1, 27760], // Glint: Facet of Chaos
        [2, 28406], // Shiro: Jade Winds
        [3, 28287], // Jalis: Rite of the Great Dwarf
        [4, 27975], // Mallyx: Embrace the Darkness
        [5, 27356], // Kalla: Soulcleave's Summit
        [6, 45773], // Ventari: Energy Expulsion
        [7, 62942], // Vindicator: Imperial Impact
      ]),
    ],
  ]);

/**
 * Map from skill ID to palette index (shared across all legends)
 * All legend-specific skills for the same slot map to the same palette index
 */
export const REVENANT_SKILL_TO_PALETTE: Map<number, number> = new Map([
  // Heal skills → 4572
  [27220, 4572], // Glint
  [26937, 4572], // Shiro
  [28219, 4572], // Jalis
  [27372, 4572], // Mallyx
  [28427, 4572], // Kalla
  [45686, 4572], // Ventari
  [62719, 4572], // Vindicator

  // Utility1 skills → 4564
  [28379, 4564], // Glint
  [29209, 4564], // Shiro
  [27322, 4564], // Jalis
  [28516, 4564], // Mallyx
  [26821, 4564], // Kalla
  [42949, 4564], // Ventari
  [62832, 4564], // Vindicator

  // Utility2 skills → 4614
  [27014, 4614], // Glint
  [28231, 4614], // Shiro
  [27505, 4614], // Jalis
  [26679, 4614], // Mallyx
  [27025, 4614], // Kalla
  [40485, 4614], // Ventari
  [62962, 4614], // Vindicator

  // Utility3 skills → 4651
  [26644, 4651], // Glint
  [27107, 4651], // Shiro
  [27917, 4651], // Jalis
  [26557, 4651], // Mallyx
  [27715, 4651], // Kalla
  [41220, 4651], // Ventari
  [62878, 4651], // Vindicator

  // Elite skills → 4554
  [27760, 4554], // Glint
  [28406, 4554], // Shiro
  [28287, 4554], // Jalis
  [27975, 4554], // Mallyx
  [27356, 4554], // Kalla
  [45773, 4554], // Ventari
  [62942, 4554], // Vindicator
]);
