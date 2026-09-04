import { getBaseUrl, useDataCache } from '../data/dataService.js';
import { useRuleVersion } from '../context/RuleVersionContext.jsx';

const entityMap = {
    spells: {
        '5e': { cacheKey: 'spells', path: 'data/spells.json' },
        '2024': { cacheKey: 'spells2024', path: 'data/2024/spells.json' },
    },
    classes: {
        '5e': { cacheKey: 'playerClasses', path: 'data/classes.json' },
        '2024': { cacheKey: 'playerClasses2024', path: 'data/2024/classes.json' },
    },
    feats: {
        '5e': { cacheKey: 'feats', path: 'data/feats.json' },
        '2024': { cacheKey: 'feats2024', path: 'data/2024/feats.json' },
    },
    races: {
        '5e': { cacheKey: 'races', path: 'data/races.json' },
        '2024': { cacheKey: 'races2024', path: 'data/2024/races.json' },
    },
};

const validEntities = Object.keys(entityMap);

export function useVersionedData(entity) {
    if (!validEntities.includes(entity)) {
        throw new Error(
            `Invalid entity "${entity}". Must be one of: ${validEntities.join(', ')}`
        );
    }

    const { ruleVersion } = useRuleVersion();
    const config = entityMap[entity][ruleVersion];

    if (!config) {
        throw new Error(
            `Entity "${entity}" does not support rule version "${ruleVersion}"`
        );
    }

    return useDataCache(config.cacheKey, getBaseUrl() + config.path);
}
