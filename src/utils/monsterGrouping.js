/**
 * Monster grouping utilities for the unified MonsterLore component
 * Pure utility functions for grouping and filtering monster data
 */

/**
 * Get monsters that belong to a specific subtype by matching monster indices
 */
export const getMonstersForSubtype = (subtype, monsters) => {
    if (!subtype.monsters || !subtype.monsters.length) {
        return [];
    }
    
    return subtype.monsters
        .map(monsterIndex => monsters.find(m => m.index === monsterIndex))
        .filter(monster => monster);
};

/**
 * Normalize a type name: lowercase and replace spaces with hyphens
 */
export const normalizeType = (type) => {
    return (type || '').toLowerCase().replace(/\s+/g, '-');
};

/**
 * Find a type-level data entry by matching normalized index or name
 */
export const findTypeData = (monsterTypesData, normalizedType) => {
    return monsterTypesData.find(t => 
        t.index === normalizedType ||
        (t.name && normalizeType(t.name) === normalizedType)
    );
};

/**
 * Resolve the parent type for a subtype by finding which type in
 * monsterTypesData has the subtype's monster indices in its monsters array.
 * Falls back to the first monster's type field if no authoritative mapping exists.
 */
const resolveParentType = (subtype, subtypeMonsters, monsterTypesData) => {
    // Find the authoritative parent type: the type whose monsters array
    // contains at least one of this subtype's monster indices
    const subtypeIndices = new Set(subtypeMonsters.map(m => m.index));
    
    for (const typeData of monsterTypesData) {
        const typeMonsters = typeData.monsters || [];
        for (const index of typeMonsters) {
            if (subtypeIndices.has(index)) {
                return {
                    displayName: typeData.name || typeData.index,
                    typeData
                };
            }
        }
    }

    // Fallback: use the first monster's type field
    if (subtypeMonsters.length > 0) {
        const fallbackType = subtypeMonsters[0].type;
        const normalizedFallback = normalizeType(fallbackType);
        const fallbackData = findTypeData(monsterTypesData, normalizedFallback);
        return {
            displayName: fallbackData?.name || fallbackType,
            typeData: fallbackData
        };
    }

    // Last resort: use the subtype's own type field
    const fallbackType = subtype.type;
    const normalizedFallback = normalizeType(fallbackType);
    const fallbackData = findTypeData(monsterTypesData, normalizedFallback);
    return {
        displayName: fallbackData?.name || fallbackType,
        typeData: fallbackData
    };
};

/**
 * Group subtypes by their parent type
 * Returns sorted array of type groups with subtypes and orphaned monsters
 */
export const groupSubtypesByType = (monsterSubtypes, monsters, monsterTypesData) => {
    const grouped = {};
    const typeMonsterIndices = {};
    
    // Phase 1: Group subtypes by parent type
    monsterSubtypes.forEach(subtype => {
        const subtypeMonsters = getMonstersForSubtype(subtype, monsters);
        if (subtypeMonsters.length === 0) {
            return;
        }

        // Resolve the authoritative parent type from monsterTypesData
        const { displayName, typeData } = resolveParentType(subtype, subtypeMonsters, monsterTypesData);

        if (!grouped[displayName]) {
            grouped[displayName] = {
                type: displayName,
                name: displayName,
                desc: typeData?.desc || '',
                trait_modifiers: typeData?.trait_modifiers || [],
                book: typeData?.book || '',
                page: typeData?.page || '',
                subtypes: [],
                monstersWithoutSubtype: []
            };
            typeMonsterIndices[displayName] = new Set();
        }

        grouped[displayName].subtypes.push({
            ...subtype,
            monsters: subtypeMonsters,
            firstMonster: subtypeMonsters[0]
        });

        subtypeMonsters.forEach(m => typeMonsterIndices[displayName].add(m.index));
    });

    // Phase 2: Ensure ALL types from monsterTypesData appear in output
    monsterTypesData.forEach(typeData => {
        const displayName = typeData.name || typeData.index;

        if (grouped[displayName]) {
            // Type has subtypes — filter out monsters already in a subtype
            const monstersInType = typeData.monsters || [];
            const monstersWithoutSubtype = monstersInType
                .filter(monsterIndex => !typeMonsterIndices[displayName].has(monsterIndex))
                .map(monsterIndex => monsters.find(m => m.index === monsterIndex))
                .filter(m => m);

            grouped[displayName].monstersWithoutSubtype = monstersWithoutSubtype;
        } else {
            // Type has no subtypes — create a new group from the type's own monsters
            const monstersInType = typeData.monsters || [];
            const monstersWithoutSubtype = monstersInType
                .map(monsterIndex => monsters.find(m => m.index === monsterIndex))
                .filter(m => m);

            grouped[displayName] = {
                type: displayName,
                name: displayName,
                desc: typeData.desc || '',
                trait_modifiers: typeData.trait_modifiers || [],
                book: typeData.book || '',
                page: typeData.page || '',
                subtypes: [],
                monstersWithoutSubtype
            };
        }
    });
    
    return Object.values(grouped).sort((a, b) => a.name.localeCompare(b.name));
};
