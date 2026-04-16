import { getNameString } from '../../../utils/monsterUtils';

/**
 * Monster2024Defenses component - Displays monster defenses including saving throws, skills, immunities, etc.
 * @param {object} monster - The monster data object
 */
function Monster2024Defenses({ monster }) {
    if (!monster) {
        return null;
    }

    const getSavingThrows = () => {
        if (!monster.saving_throws) return '';
        const entries = Object.entries(monster.saving_throws);
        if (entries.length === 0) return '';
        
        return entries.map(([key, value]) => {
            const abilityMap = {
                str: 'STR',
                dex: 'DEX',
                con: 'CON',
                int: 'INT',
                wis: 'WIS',
                cha: 'CHA'
            };
            const abilityName = abilityMap[key] || key.toUpperCase();
            return `${abilityName} +${value.modifier}`;
        }).join(', ');
    };

    const getSkills = () => {
        if (!monster.skills) return '';
        const entries = Object.entries(monster.skills);
        if (entries.length === 0) return '';
        
        return entries.map(([key, value]) => {
            const skillMap = {
                acrobatics: 'Acrobatics',
                animal_handling: 'Animal Handling',
                arcana: 'Arcana',
                athletics: 'Athletics',
                deception: 'Deception',
                history: 'History',
                insight: 'Insight',
                intimidation: 'Intimidation',
                perception: 'Perception',
                performance: 'Performance',
                persuasion: 'Persuasion',
                religion: 'Religion',
                sleight_of_hand: 'Sleight of Hand',
                stealth: 'Stealth',
                survival: 'Survival'
            };
            const skillName = skillMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return `${skillName} +${value.modifier}`;
        }).join(', ');
    };

    const getSenses = () => {
        if (!monster.senses) return '';
        let senses = '';
        if (monster.senses.blindsight) {
            senses += `blindsight ${monster.senses.blindsight}, `;
        }
        if (monster.senses.darkvision) {
            senses += `darkvision ${monster.senses.darkvision}, `;
        }
        if (monster.senses.truesight) {
            senses += `truesight ${monster.senses.truesight}, `;
        }
        if (monster.senses.tremorsense) {
            senses += `tremorsense ${monster.senses.tremorsense}, `;
        }
        if (monster.senses.passive_perception) {
            senses += `passive perception ${monster.senses.passive_perception}, `;
        }
        return senses.trim().replace(/, $/, '');
    };

    return (
        <div className="monster2024Defenses-monster-defenses">
            {monster.saving_throws && Object.keys(monster.saving_throws).length > 0 && (
                <div>
                    <b>Saving Throws:</b>&nbsp;{getSavingThrows()}
                </div>
            )}
            {monster.skills && Object.keys(monster.skills).length > 0 && (
                <div>
                    <b>Skills:</b>&nbsp;{getSkills()}
                </div>
            )}
            {monster.immunities && monster.immunities.length > 0 && (
                <div>
                    <b>Immunities:</b>&nbsp;{getNameString(monster.immunities)}
                </div>
            )}
            {monster.vulnerabilities && monster.vulnerabilities.length > 0 && (
                <div>
                    <b>Vulnerabilities:</b>&nbsp;{getNameString(monster.vulnerabilities)}
                </div>
            )}
            {monster.resistances && monster.resistances.length > 0 && (
                <div>
                    <b>Resistances:</b>&nbsp;{getNameString(monster.resistances)}
                </div>
            )}
            <div>
                <b>Senses:</b>&nbsp;{getSenses()}
            </div>
            {monster.languages && (
                <div>
                    <b>Languages:</b>&nbsp;{monster.languages}
                </div>
            )}
            {monster.challenge_rating && (
                <div>
                    <b>Challenge:</b>&nbsp;{monster.challenge_rating}&nbsp;({monster.xp} XP)
                </div>
            )}
            {monster.legendary_resistance && monster.legendary_resistance > 0 && (
                <div>
                    <b>Legendary Resistance:</b>&nbsp;{monster.legendary_resistance} uses/day
                </div>
            )}
            {monster.equipment && monster.equipment.length > 0 && (
                <div>
                    <b>Equipment:</b>&nbsp;{monster.equipment.join(', ')}
                </div>
            )}
            {monster.habitat && (
                <div>
                    <b>Habitat:</b>&nbsp;{monster.habitat}
                </div>
            )}
            {monster.treasure && (
                <div>
                    <b>Treasure:</b>&nbsp;{monster.treasure}
                </div>
            )}
        </div>
    );
}

export default Monster2024Defenses;
