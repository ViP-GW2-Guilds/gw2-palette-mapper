# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-22

### Production Release

First production-ready release with all critical bugs fixed and validation support.

**Highlights:**
- ✅ All critical bugs fixed (API schema header, palette parsing)
- ✅ Build validation support via metadata methods
- ✅ Compatible with gw2-build-decoder v1.0.0
- ✅ 11 tests passing, production-ready

### Added
- `getSkillInfo(skillId)` method for fetching skill metadata
- `getSpecializationInfo(specId)` method for fetching specialization metadata
- `getPetInfo(petId)` method for fetching pet metadata
- Implements MetadataProvider interface from gw2-build-decoder v1.0.0
- GW2ApiSkill, GW2ApiSpecialization, GW2ApiPet type definitions
- `fetchSkill()`, `fetchSpecialization()`, `fetchPet()` to GW2ApiClient
- Complete CHANGELOG and enhanced README

### Changed
- **BREAKING:** Updated peerDependencies to require gw2-build-decoder ^1.0.0
- Metadata methods return null for not-found cases (graceful degradation)

### Fixed
- **Critical:** Added X-Schema-Version: 2019-12-19T00:00:00.000Z header to API requests
- **Critical:** Fixed skills_by_palette parsing as array of [paletteId, skillId] tuples
- Corrected type definition to match actual API structure

### Notes
- All critical bugs from v0.2.4-0.2.7 are now fixed
- Fully compatible with decoder v1.0.0 aquatic skills support
- Enables BuildValidator functionality

## [0.3.0] - 2026-01-22 (Pre-release)

### Added
- `getSkillInfo(skillId)` method for fetching skill metadata from GW2 API
- `getSpecializationInfo(specId)` method for fetching specialization metadata
- `getPetInfo(petId)` method for fetching pet metadata
- Implements MetadataProvider interface from gw2-build-decoder v1.0.0
- GW2ApiSkill, GW2ApiSpecialization, GW2ApiPet type definitions
- `fetchSkill()`, `fetchSpecialization()`, `fetchPet()` methods to GW2ApiClient

### Changed
- Updated peerDependencies to support gw2-build-decoder ^1.0.0
- Metadata methods return null for not-found cases (graceful degradation)

### Notes
- These methods enable BuildValidator in gw2-build-decoder to verify decoded builds
- API responses are not cached separately (use caching at validator level if needed)

## [0.2.7] - 2026-01-22

### Changed
- Updated peerDependencies to support gw2-build-decoder ^0.3.0

## [0.2.6] - 2026-01-22

### Fixed
- Correctly parse skills_by_palette as array of [paletteId, skillId] tuples
- Updated type definition to accurately reflect API structure
- Fixed palette index lookups which were using array indices instead of palette IDs

### Changed
- Updated test mock data to use correct tuple format

## [0.2.5] - 2026-01-22

### Fixed
- **Critical:** Added X-Schema-Version: 2019-12-19T00:00:00.000Z header to API requests
- Without this header, GW2 API returns older schema missing skills_by_palette field

### Notes
- This was the root cause of all palette mapping failures in earlier versions

## [0.2.4] - Earlier

Initial published version.

## Migration Guide

### Upgrading to v0.3.0

No breaking changes. New methods added for validation support:

```typescript
const mapper = new GW2PaletteMapper();

// New in v0.3.0 - fetch metadata for validation
const skillInfo = await mapper.getSkillInfo(10527);
console.log(skillInfo.name); // "Well of Blood"
console.log(skillInfo.professions); // ["Necromancer"]

const specInfo = await mapper.getSpecializationInfo(53);
console.log(specInfo.name); // "Spite"
console.log(specInfo.profession); // "Necromancer"
```

All existing code continues to work unchanged.

## Compatibility Matrix

| palette-mapper | decoder | Status |
|---------------|---------|--------|
| 0.2.4 | 0.2.0 | ❌ Critical bugs |
| 0.2.5-0.2.7 | 0.2.0-0.3.x | ✅ Works, but data loss |
| 0.3.0+ | 1.0.0+ | ✅ Production-ready |

**Recommendation:** Always use latest versions of both packages together.
