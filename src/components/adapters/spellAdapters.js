/**
 * Normalize a 5e spell into a common data shape
 */
export function normalizeSpell5e(spell) {
    if (!spell) return null;

    return {
         // Basic info
        index: spell.index,
        name: spell.name,
        level: spell.level,
        school: spell.school,
        ritual: spell.ritual,
        castingTime: spell.casting_time,
        range: spell.range,
        components: spell.components,
        material: spell.material,
        duration: spell.duration,
        concentration: spell.concentration,
        classes: spell.classes || [],
        subclasses: [],
        areaOfEffect: spell.area_of_effect,
        damage: spell.damage,
        savingThrow: null,
        statusEffects: [],
        known: spell.known,
        prepared: spell.prepared,

         // Description
        desc: spell.desc || [],
        higherLevel: spell.higher_level,

         // Version metadata
        version: '5e'
     };
}

/**
 * Normalize a 2024 spell into a common data shape
 */
export function normalizeSpell2024(spell) {
    if (!spell) return null;

    return {
         // Basic info
        index: spell.index,
        name: spell.name,
        level: spell.level,
        school: spell.school,
        ritual: spell.ritual,
        castingTime: spell.casting_time,
        range: spell.range,
        components: spell.components || [],
        material: spell.material,
        duration: spell.duration,
        concentration: spell.concentration,
        classes: spell.classes || [],
        subclasses: spell.subclasses || [],
        areaOfEffect: spell.area_of_effect,
        damage: spell.damage,
        savingThrow: spell.saving_throw,
        statusEffects: spell.status_effects || [],
        known: spell.known,
        prepared: spell.prepared,

         // Description
        desc: spell.desc || [],
        higherLevel: spell.higher_level || [],

         // Version metadata
        version: '2024'
     };
}