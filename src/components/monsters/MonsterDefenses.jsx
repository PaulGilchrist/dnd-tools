import { getNameString } from '../../utils/monsterUtils';

function MonsterDefenses({ monster }) {
    if (!monster) {
        return null;
    }

    const getSavingThrows = () => {
        if (!monster.proficiencies) return '';
        let savingThrows = '';
        monster.proficiencies.forEach((proficiency) => {
            if (proficiency.name.startsWith('Saving Throw:')) {
                savingThrows += `${proficiency.name.substring(14, 17)} +${proficiency.value}, `;
            }
        });
        return savingThrows.substring(0, savingThrows.length - 2);
    };

    const getSkills = () => {
        if (!monster.proficiencies) return '';
        let skills = '';
        monster.proficiencies.forEach((proficiency) => {
            if (proficiency.name.startsWith('Skill:')) {
                skills += `${proficiency.name.substring(7)} +${proficiency.value}, `;
            }
        });
        return skills.substring(0, skills.length - 2);
    };

    const hasSavingThrows = () => {
        if (!monster.proficiencies) return false;
        let hasSavingThrows = false;
        monster.proficiencies.forEach((proficiency) => {
            if (proficiency.name.startsWith('Saving Throw:')) {
                hasSavingThrows = true;
            }
        });
        return hasSavingThrows;
    };

    const hasSkills = () => {
        if (!monster.proficiencies) return false;
        let hasSkills = false;
        monster.proficiencies.forEach((proficiency) => {
            if (proficiency.name.startsWith('Skill:')) {
                hasSkills = true;
            }
        });
        return hasSkills;
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
        if (monster.senses.passive_perception) {
            senses += `passive perception ${monster.senses.passive_perception}, `;
        }
        if (monster.senses.tremorsense) {
            senses += `tremorsense ${monster.senses.tremorsense}, `;
        }
        if (monster.senses.truesight) {
            senses += `truesight ${monster.senses.truesight}, `;
        }
        return senses.substring(0, senses.length - 2);
    };

    return (
        <>
            {hasSavingThrows() && (
                <div>
                    <b>Saving Throws:</b>&nbsp;{getSavingThrows()}<br />
                </div>
            )}
            {hasSkills() && (
                <div>
                    <b>Skills:</b>&nbsp;{getSkills()}<br />
                </div>
            )}
            {monster.condition_immunities && monster.condition_immunities.length > 0 && (
                <div>
                    <b>Condition Immunities:</b>&nbsp;{getNameString(monster.condition_immunities)}<br />
                </div>
            )}
            {monster.damage_immunities && monster.damage_immunities.length > 0 && (
                <div>
                    <b>Damage Immunities:</b>&nbsp;{getNameString(monster.damage_immunities)}<br />
                </div>
            )}
            {monster.damage_resistances && monster.damage_resistances.length > 0 && (
                <div>
                    <b>Damage Resistances:</b>&nbsp;{getNameString(monster.damage_resistances)}<br />
                </div>
            )}
            {monster.damage_vulnerabilities && monster.damage_vulnerabilities.length > 0 && (
                <div>
                    <b>Damage Vulnerabilities:</b>&nbsp;{getNameString(monster.damage_vulnerabilities)}<br />
                </div>
            )}
            <b>Senses:</b>&nbsp;{getSenses()}<br />
            {monster.languages && (
                <div>
                    <b>Languages:</b>&nbsp;{monster.languages}<br />
                </div>
            )}
            {monster.environments && monster.environments.length > 0 && (
                <div>
                    <b>Environments:</b>&nbsp;{getNameString(monster.environments)}<br />
                </div>
            )}
            {monster.allies && monster.allies.length > 0 && (
                <div>
                    <b>Allies:</b>&nbsp;{getNameString(monster.allies)}<br />
                </div>
            )}
            {monster.enemies && monster.enemies.length > 0 && (
                <div>
                    <b>Enemies:</b>&nbsp;{getNameString(monster.enemies)}<br />
                </div>
            )}
            <b>Challenge:</b>&nbsp;{monster.challenge_rating}&nbsp;({monster.xp} XP)<br />
        </>
    );
}

export default MonsterDefenses;
