# gw2-palette-mapper

Palette mapping implementation for GW2 official build codes. Provides bidirectional mapping between palette indices and skill IDs using the official GW2 API.

## Installation

This package is published to GitHub Packages.

### Step 1: Configure npm/pnpm to use GitHub Packages

Create a `.npmrc` file in your project root (or add to existing):

```
@vip-gw2-guilds:registry=https://npm.pkg.github.com
```

### Step 2: Install

```bash
pnpm add @vip-gw2-guilds/gw2-palette-mapper
pnpm add @vip-gw2-guilds/gw2-build-decoder
# or
npm install @vip-gw2-guilds/gw2-palette-mapper
npm install @vip-gw2-guilds/gw2-build-decoder
```

## Requirements

- Node.js >= 22.0.0
- `@vip-gw2-guilds/gw2-build-decoder` ^1.0.0 (recommended) or ^0.2.0+

## Quick Start

```typescript
import { GW2PaletteMapper } from '@vip-gw2-guilds/gw2-palette-mapper';
import { decode, Profession } from '@vip-gw2-guilds/gw2-build-decoder';

// Create mapper (fetches data from GW2 API on first use)
const mapper = new GW2PaletteMapper();

// Use with decoder
const chatLink = '[&DQg1KTIlIjbBEgAAgQB1AUABgQB1AUABlQCVAAAAAAAAAAAAAAAAAAAAAAA=]';
const build = await decode(chatLink, mapper);

console.log('Profession:', build.profession);
console.log('Heal skill ID:', build.skills.heal);
```

## Configuration

```typescript
const mapper = new GW2PaletteMapper({
  apiUrl: 'https://api.guildwars2.com', // Custom API URL
  cacheTtl: 30 * 60 * 1000, // Cache duration (default: 30 min)
  timeout: 5000, // API timeout (default: 5 sec)
});
```

## Features

- ✅ Bidirectional palette ↔ skill mapping
- ✅ Support for all 9 GW2 professions
- ✅ In-memory caching (30-minute TTL)
- ✅ Automatic GW2 API fetching (lazy loaded per profession)
- ✅ **Build validation support** (v0.3.0+) - skill/spec/pet metadata
- ✅ TypeScript strict mode
- ✅ Zero runtime dependencies (uses Node.js built-in fetch)
- ⚠️ Limited Revenant support (see [Limitations](#limitations))

## API Reference

### `GW2PaletteMapper`

Implements the `PaletteMapper` interface from `gw2-build-decoder`.

#### Constructor

```typescript
new GW2PaletteMapper(options?: PaletteMapperOptions)
```

**Options:**
- `apiUrl` (string): GW2 API base URL (default: `https://api.guildwars2.com`)
- `cacheTtl` (number): Cache duration in milliseconds (default: 30 minutes)
- `timeout` (number): API request timeout in milliseconds (default: 5 seconds)

#### Methods

##### `paletteToSkill(profession, paletteIndex): Promise<number>`

Convert a palette index to a skill ID.

```typescript
const skillId = await mapper.paletteToSkill(Profession.Necromancer, 4572);
console.log(skillId); // 10527 (Well of Blood)
```

**Parameters:**
- `profession` (Profession): Character profession (1-9)
- `paletteIndex` (number): Palette index from build code

**Returns:** Promise resolving to skill ID

**Throws:** Error if palette index is not mapped

##### `skillToPalette(profession, skillId): Promise<number>`

Convert a skill ID to a palette index.

```typescript
const paletteIndex = await mapper.skillToPalette(Profession.Necromancer, 10527);
console.log(paletteIndex); // 4572
```

**Parameters:**
- `profession` (Profession): Character profession (1-9)
- `skillId` (number): Skill ID to encode

**Returns:** Promise resolving to palette index

**Throws:** Error if skill ID is not mapped

##### `clearCache(profession?): void`

Clear cached palette data.

```typescript
// Clear cache for a specific profession
mapper.clearCache(Profession.Guardian);

// Clear all caches
mapper.clearCache();
```

**Parameters:**
- `profession` (Profession, optional): Profession to clear (if undefined, clears all)

##### `getSkillInfo(skillId): Promise<SkillInfo | null>` (v0.3.0+)

Fetch skill metadata from GW2 API for validation.

```typescript
const skillInfo = await mapper.getSkillInfo(10527);
console.log(skillInfo.name); // "Well of Blood"
console.log(skillInfo.professions); // ["Necromancer"]
console.log(skillInfo.type); // "Utility"
```

**Parameters:**
- `skillId` (number): Skill ID to look up

**Returns:** Promise resolving to skill info, or null if not found

##### `getSpecializationInfo(specId): Promise<SpecializationInfo | null>` (v0.3.0+)

Fetch specialization metadata from GW2 API for validation.

```typescript
const specInfo = await mapper.getSpecializationInfo(53);
console.log(specInfo.name); // "Spite"
console.log(specInfo.profession); // "Necromancer"
console.log(specInfo.elite); // false
```

**Parameters:**
- `specId` (number): Specialization ID to look up

**Returns:** Promise resolving to specialization info, or null if not found

##### `getPetInfo(petId): Promise<PetInfo | null>` (v0.3.0+)

Fetch pet metadata from GW2 API for validation.

```typescript
const petInfo = await mapper.getPetInfo(59);
console.log(petInfo.name); // "Moa"
```

**Parameters:**
- `petId` (number): Pet ID to look up

**Returns:** Promise resolving to pet info, or null if not found

## Build Validation (v0.3.0+)

The palette mapper implements the `MetadataProvider` interface, making it compatible with `BuildValidator` from gw2-build-decoder v1.0.0+:

```typescript
import { decode, BuildValidator } from '@vip-gw2-guilds/gw2-build-decoder';
import { GW2PaletteMapper } from '@vip-gw2-guilds/gw2-palette-mapper';

const mapper = new GW2PaletteMapper();
const validator = new BuildValidator(mapper); // Mapper provides metadata

const build = await decode(chatLink, mapper);
const result = await validator.validate(build);

if (!result.valid) {
  result.errors.forEach(error => {
    console.error(`[${error.type}] ${error.message}`);
  });
}
```

The validator checks:
- ✅ All skill IDs exist in GW2 API
- ✅ Skills can be used by the profession
- ✅ Specialization IDs exist and belong to the profession
- ✅ Pet IDs are valid (for Rangers)

## How It Works

1. **First use:** When you call `paletteToSkill` or `skillToPalette` for a profession, the mapper fetches data from the GW2 API
2. **Caching:** The response is cached in memory for 30 minutes (configurable)
3. **Lazy loading:** Only fetches data for professions you actually use
4. **Bidirectional:** Builds both palette→skill and skill→palette maps from API data

### API Endpoint

Uses: `https://api.guildwars2.com/v2/professions/{ProfessionName}`

**Important:** Requires header `X-Schema-Version: 2019-12-19T00:00:00.000Z` to get `skills_by_palette` field.

Example response structure:
```json
{
  "id": "Guardian",
  "name": "Guardian",
  "skills_by_palette": [
    [1, 12343],
    [2, 12417],
    [3, 12371],
    [4, 12337],
    ...
  ]
}
```

The `skills_by_palette` field is an array of `[paletteId, skillId]` tuples.

## Limitations

### Revenant Legend-Based Mapping

**Current Behavior:** Uses base API mappings for Revenant. The GW2 API provides one skill per palette index.

**Issue:** In the actual game, Revenant palette indices map to different skills depending on the active legend. For example, palette index 4572 maps to different heal skills for Shiro vs. Ventari.

**Impact:** Revenant builds may not decode/encode with 100% accuracy for legend-specific skills.

**Workaround:** The base API mappings work for most common cases. Full legend support would require:
1. Extending the `PaletteMapper` interface to accept legend context
2. Implementing legend-specific override mappings
3. Updating the decoder to pass legend information to the mapper

This is planned for a future version (v0.2.0+) if needed.

## Error Handling

```typescript
import { GW2PaletteMapper } from '@vip-gw2-guilds/gw2-palette-mapper';
import { decode, BuildCodeError, BuildCodeErrorCode } from '@vip-gw2-guilds/gw2-build-decoder';

const mapper = new GW2PaletteMapper();

try {
  const build = await decode(chatLink, mapper);
} catch (error) {
  if (error instanceof BuildCodeError) {
    if (error.code === BuildCodeErrorCode.PALETTE_LOOKUP_FAILED) {
      console.error('Palette mapping failed:', error.message);
    }
  } else {
    // API error, timeout, network error, etc.
    console.error('Unexpected error:', error);
  }
}
```

## Development

```bash
# Clone the repository
git clone https://github.com/ViP-GW2-Guilds/gw2-palette-mapper.git
cd gw2-palette-mapper

# Install dependencies
pnpm install

# Build
pnpm build

# Test
pnpm test

# Test with coverage
pnpm test:coverage
```

## Publishing

This package uses GitHub Actions for automated publishing. To release a new version:

1. Update the version in `package.json`
2. Commit and push to `main`
3. GitHub Actions will automatically build, tag, and publish

## Repository

- GitHub: https://github.com/ViP-GW2-Guilds/gw2-palette-mapper
- Issues: https://github.com/ViP-GW2-Guilds/gw2-palette-mapper/issues
- Packages: https://github.com/orgs/ViP-GW2-Guilds/packages

## Related Projects

- [@vip-gw2-guilds/gw2-build-decoder](https://github.com/ViP-GW2-Guilds/gw2-build-decoder) - GW2 build template decoder/encoder
- [HsBuildCodes](https://github.com/HardstuckGuild/HsBuildCodes) - Original implementation with Hardstuck format support

## Data Source

- GW2 Official API: https://api.guildwars2.com/v2/professions
- API Documentation: https://wiki.guildwars2.com/wiki/API:2/professions

## License

MIT
