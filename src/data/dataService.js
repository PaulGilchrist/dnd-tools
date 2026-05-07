// Backward-compatible barrel — all existing imports from './dataService' continue to work

// Core caching layer
export { dataCache, loadingPromises, fetchAndCache } from './dataServiceCore.js';

// Hooks (core + 18 individual)
export {
    useDataCache,
    useAbilityScores,
    useConditions,
    useEquipment,
    useFeats,
    useLocations,
    useMagicItems,
    useMonsters,
    useMonsterTypes,
    useNames,
    usePlayerClasses,
    useRaces,
    useRules,
    useSpells,
    use2024Spells,
    use2024Monsters,
    use2024MonsterTypes,
    use2024MonsterSubtypes,
    use2024MagicItems,
    useWeaponProperties,
    use2024Classes,
    use2024Races,
    use2024Backgrounds,
    use2024Feats,
    useWeaponMastery2024,
} from './dataServiceHooks.js';

// Utilities + test helpers
export { getBaseUrl, sort, handleError, __clearCache } from './dataServiceUtils.js';
