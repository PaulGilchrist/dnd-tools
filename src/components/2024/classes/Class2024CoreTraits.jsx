import React from 'react';
import './Class2024CoreTraits.css';

/**
 * Component to display the core traits of a player class
 */
function Class2024CoreTraits({ coreTraits }) {
    if (!coreTraits) {
        return null;
    }

    return (
        <div className="core-traits-embedded class2024-core-traits-embedded">
            <h5>Core Traits</h5>
            {coreTraits.primary_ability && (
                <div>
                    <b>Primary Ability:</b>&nbsp;{coreTraits.primary_ability}
                </div>
            )}
            {coreTraits.hit_point_die && (
                <div>
                    <b>Hit Die:</b>&nbsp;{coreTraits.hit_point_die}
                </div>
            )}
            {coreTraits.saving_throw_proficiencies && (
                <div>
                    <b>Saving Throw Proficiencies:</b>&nbsp;{coreTraits.saving_throw_proficiencies}
                </div>
            )}
            {coreTraits.skill_proficiencies && (
                <div>
                    <b>Skill Proficiencies:</b>&nbsp;{coreTraits.skill_proficiencies}
                </div>
            )}
            {coreTraits.weapon_proficiencies && (
                <div>
                    <b>Weapon Proficiencies:</b>&nbsp;{coreTraits.weapon_proficiencies}
                </div>
            )}
            {coreTraits.armor_training && (
                <div>
                    <b>Armor Training:</b>&nbsp;{coreTraits.armor_training}
                </div>
            )}
            {coreTraits.tool_proficiencies && (
                <div>
                    <b>Tool Proficiencies:</b>&nbsp;{coreTraits.tool_proficiencies}
                </div>
            )}
            {coreTraits.starting_equipment && (
                <div>
                    <b>Starting Equipment:</b>&nbsp;{coreTraits.starting_equipment}
                </div>
            )}
        </div>
    );
}

export default Class2024CoreTraits;