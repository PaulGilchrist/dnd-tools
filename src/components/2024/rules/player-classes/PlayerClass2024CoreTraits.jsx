import React from 'react';
import './PlayerClass2024CoreTraits.css';

/**
 * Component to display the core traits of a player class
 */
function PlayerClass2024CoreTraits({ playerClass }) {
    if (!playerClass) {
        return null;
    }

    // Format hit_point_die: the data is now a number (e.g., 12), so we add "d" prefix
    const formatHitDie = (hitPointDie) => {
        if (!hitPointDie) return '';
        // hit_point_die is now a number like "D12" or just the number part
        if (typeof hitPointDie === 'string') {
            return hitPointDie;
        }
        return `d${hitPointDie}`;
     };

    // Format saving_throw_proficiencies: now an array, so join with ", "
    const formatSavingThrows = (savingThrows) => {
        if (!savingThrows || savingThrows.length === 0) return '';
        return savingThrows.join(', ');
     };

    return (
         <div className="core-traits-embedded class2024-core-traits-embedded">
             <h5>Core Traits</h5>
             {playerClass.primary_ability && (
                 <div>
                     <b>Primary Ability:</b>&nbsp;{playerClass.primary_ability}
                 </div>
             )}
             {playerClass.hit_point_die && (
                 <div>
                     <b>Hit Die:</b>&nbsp;{formatHitDie(playerClass.hit_point_die)}
                 </div>
             )}
             {playerClass.saving_throw_proficiencies && playerClass.saving_throw_proficiencies.length > 0 && (
                 <div>
                     <b>Saving Throw Proficiencies:</b>&nbsp;{formatSavingThrows(playerClass.saving_throw_proficiencies)}
                 </div>
             )}
             {playerClass.skill_proficiency_choices && (
                 <div>
                     <b>Skill Proficiencies:</b>&nbsp;{playerClass.skill_proficiency_choices}
                 </div>
             )}
             {playerClass.weapon_proficiencies && (
                 <div>
                     <b>Weapon Proficiencies:</b>&nbsp;{playerClass.weapon_proficiencies}
                 </div>
             )}
             {playerClass.armor_training && (
                 <div>
                     <b>Armor Training:</b>&nbsp;{playerClass.armor_training}
                 </div>
             )}
             {playerClass.tool_proficiencies && (
                 <div>
                     <b>Tool Proficiencies:</b>&nbsp;{playerClass.tool_proficiencies}
                 </div>
             )}
             {playerClass.starting_equipment && (
                 <div>
                     <b>Starting Equipment:</b>&nbsp;{playerClass.starting_equipment}
                 </div>
             )}
         </div>
     );
}

export default PlayerClass2024CoreTraits;