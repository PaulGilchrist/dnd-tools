import { getNameString } from '../../utils/monsterUtils';

/**
 * Common MonsterDefenses component - Displays monster defenses
 * Works with normalized monster data from both 5e and 2024 versions
 * @param {object} monster - The normalized monster data object
 */
function MonsterDefenses({ monster }) {
    if (!monster) {
        return null;
      }

    const getSavingThrows = () => {
        if (!monster.savingThrows || Object.keys(monster.savingThrows).length === 0) return '';
        const entries = Object.entries(monster.savingThrows);
        const abilityMap = {
            str: 'STR',
            dex: 'DEX',
            con: 'CON',
            int: 'INT',
            wis: 'WIS',
            cha: 'CHA'
         };
        return entries.map(([key, value]) => {
            const abilityName = abilityMap[key] || key.toUpperCase();
            return `${abilityName} +${value.modifier}`;
         }).join(', ');
     };

    const getSkills = () => {
        if (!monster.skills || Object.keys(monster.skills).length === 0) return '';
        const entries = Object.entries(monster.skills);
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
        return entries.map(([key, value]) => {
            const skillName = skillMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return `${skillName} +${value.modifier}`;
         }).join(', ');
     };

    const getSenses = () => {
        if (!monster.senses || Object.keys(monster.senses).length === 0) return '';
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

    const hasSavingThrows = () => {
        return monster.savingThrows && Object.keys(monster.savingThrows).length > 0;
      };

    const hasSkills = () => {
        return monster.skills && Object.keys(monster.skills).length > 0;
      };

    return (
          <div className="monsterDefenses-monster-defenses">
              {hasSavingThrows() && (
                  <div>
                      <b>Saving Throws:</b>&nbsp;{getSavingThrows()}
                  </div>
              )}
              {hasSkills() && (
                  <div>
                      <b>Skills:</b>&nbsp;{getSkills()}
                  </div>
              )}
              {monster.conditionImmunities && monster.conditionImmunities.length > 0 && (
                  <div>
                      <b>Condition Immunities:</b>&nbsp;{getNameString(monster.conditionImmunities)}
                  </div>
              )}
              {monster.damageImmunities && monster.damageImmunities.length > 0 && (
                  <div>
                      <b>Damage Immunities:</b>&nbsp;{getNameString(monster.damageImmunities)}
                  </div>
              )}
              {monster.damageResistances && monster.damageResistances.length > 0 && (
                  <div>
                      <b>Damage Resistances:</b>&nbsp;{getNameString(monster.damageResistances)}
                  </div>
              )}
              {monster.damageVulnerabilities && monster.damageVulnerabilities.length > 0 && (
                  <div>
                      <b>Damage Vulnerabilities:</b>&nbsp;{getNameString(monster.damageVulnerabilities)}
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
              {monster.environments && monster.environments.length > 0 && (
                  <div>
                      <b>Environments:</b>&nbsp;{getNameString(monster.environments)}
                  </div>
              )}
              {monster.allies && monster.allies.length > 0 && (
                  <div>
                      <b>Allies:</b>&nbsp;{getNameString(monster.allies)}
                  </div>
              )}
              {monster.enemies && monster.enemies.length > 0 && (
                  <div>
                      <b>Enemies:</b>&nbsp;{getNameString(monster.enemies)}
                  </div>
              )}
              {monster.challengeRating && (
                  <div>
                      <b>Challenge:</b>&nbsp;{monster.challengeRating}&nbsp;({monster.xp} XP)
                  </div>
              )}
              {monster.legendaryResistance && monster.legendaryResistance > 0 && (
                  <div>
                      <b>Legendary Resistance:</b>&nbsp;{monster.legendaryResistance} uses/day
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

export default MonsterDefenses;