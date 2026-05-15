// Parse prerequisite objects into a readable string
// Handles feature, level, proficiency, and Spell prerequisite types
export function getPrerequisites(prerequisites) {
    if (!prerequisites || prerequisites.length === 0) return '';

    const parts = prerequisites.map((prerequisite) => {
        switch (prerequisite.type) {
            case 'feature':
                return `feature ${prerequisite.feature.substring(14)}`;
            case 'level':
                return '';
            case 'proficiency':
                return `proficiency ${prerequisite.proficiency.substring(19)}`;
            case 'Spell':
                return `spell ${prerequisite.spell.substring(12)}`;
            default: {
                const key = Object.keys(prerequisite).find(k => k !== 'type');
                return key ? `${prerequisite.type} ${prerequisite[key]}` : '';
            }
        }
    }).filter(Boolean);

    return parts.join(', ');
}
