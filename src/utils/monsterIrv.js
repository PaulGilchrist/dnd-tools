// Condition names that appear mixed into legacy `immunities` lists
// (port of the canonical list from dnd-campaign-suite's monsterIrvUtils.js).
const LEGACY_CONDITION_NAMES = new Set([
    'blinded', 'charmed', 'cursed', 'deafened', 'frightened', 'grappled',
    'incapacitated', 'paralyzed', 'petrified', 'poisoned', 'prone', 'restrained',
    'slow', 'stunned', 'unconscious', 'exhaustion', 'diseased',
]);

function hasEntries(list) {
    return Array.isArray(list) && list.length > 0;
}

/**
 * monsters.json stores immunities/resistances/vulnerabilities (IRV) under two schemas:
 *  - 2024-batch monsters: damage_immunities / damage_resistances / damage_vulnerabilities / condition_immunities
 *  - legacy monsters: immunities / resistances / vulnerabilities, with damage types AND condition
 *    names mixed together inside `immunities`
 * Resolve either shape into split lists. 2024 keys win when they have entries.
 *
 * @param {object} monsterData - Raw monster data from monsters.json
 * @returns {{ immunities: string[], resistances: string[], vulnerabilities: string[], conditionImmunities: string[] }}
 *   where `immunities` contains damage-type immunities only
 */
export function resolveMonsterIRV(monsterData) {
    const data = monsterData || {};

    const resistances = hasEntries(data.damage_resistances)
        ? data.damage_resistances
        : (data.resistances || []);
    const vulnerabilities = hasEntries(data.damage_vulnerabilities)
        ? data.damage_vulnerabilities
        : (data.vulnerabilities || []);

    if (hasEntries(data.damage_immunities)) {
        return {
            immunities: data.damage_immunities,
            resistances,
            vulnerabilities,
            conditionImmunities: data.condition_immunities || [],
        };
    }

    const legacyImmunities = data.immunities || [];
    const conditionImmunities = legacyImmunities.filter(v => LEGACY_CONDITION_NAMES.has(String(v).toLowerCase()));
    const immunities = legacyImmunities.filter(v => !LEGACY_CONDITION_NAMES.has(String(v).toLowerCase()));

    if (!hasEntries(conditionImmunities) && hasEntries(data.condition_immunities)) {
        return { immunities, resistances, vulnerabilities, conditionImmunities: data.condition_immunities };
    }
    return { immunities, resistances, vulnerabilities, conditionImmunities };
}
