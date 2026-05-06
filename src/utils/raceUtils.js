/**
 * Race utility functions for RaceItem2024
 * Pure utility functions for extracting race data
 */

/**
 * Get ability bonuses text from race data
 * Returns null if no ability bonuses exist
 */
export const getAbilityBonuses = (race) => {
    if (!race.ability_score_increase && (!race.ability_score_options || race.ability_score_options.length === 0)) {
        return null;
    }

    let bonuses = '';

    if (race.ability_score_increase) {
        bonuses = `${race.ability_score_increase} +1`;
    }

    if (race.ability_score_options && race.ability_score_options.length > 0) {
        const options = race.ability_score_options.map(option =>
            `${option.ability_score} +${option.bonus}`
        ).join(', ');
        bonuses = options;
    }

    return bonuses;
};

/**
 * Get languages text from race data
 * Returns null if no languages exist
 */
export const getLanguages = (race) => {
    if (!race.languages || race.languages.length === 0) {
        return null;
    }
    if (race.language_desc) {
        return race.language_desc;
    }
    return race.languages.join(', ');
};
