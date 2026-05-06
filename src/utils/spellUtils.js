/**
 * Spell utility functions for SpellCard
 * Pure utility functions for extracting spell data
 */

/**
 * Get comma-separated classes string from spell data
 */
export const getClasses = (spell) => {
    if (!spell.classes || spell.classes.length === 0) {
        return '';
    }
    let classes = '';
    spell.classes.forEach((spellClass) => {
        classes += `${spellClass}, `;
    });
    return classes.substring(0, classes.length - 2);
};

/**
 * Convert a spell level number to display text (e.g., "Cantrip", "1st-level")
 */
export const getLevelText = (level) => {
    switch (level) {
        case 0:
            return 'Cantrip';
        case 1:
            return '1st-level';
        case 2:
            return '2nd-level';
        case 3:
            return '3rd-level';
        default:
            return level + 'th-level';
    }
};
