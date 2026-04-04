import { useState } from 'react';

function MonsterAbilityScores({ monster }) {
    const getAbilityModifier = (abilityScore) => {
        return Math.floor((abilityScore - 10) / 2);
    };

    if (!monster) {
        return null;
    }

    return (
        <div className="abilities">
            <div className="ability">
                <div className="ability-name">STR</div>
                <div>{monster.strength} ({getAbilityModifier(monster.strength)})</div>
            </div>
            <div className="ability">
                <div className="ability-name">DEX</div>
                <div>{monster.dexterity} ({getAbilityModifier(monster.dexterity)})</div>
            </div>
            <div className="ability">
                <div className="ability-name">CON</div>
                <div>{monster.constitution} ({getAbilityModifier(monster.constitution)})</div>
            </div>
            <div className="ability">
                <div className="ability-name">INT</div>
                <div>{monster.intelligence} ({getAbilityModifier(monster.intelligence)})</div>
            </div>
            <div className="ability">
                <div className="ability-name">WIS</div>
                <div>{monster.wisdom} ({getAbilityModifier(monster.wisdom)})</div>
            </div>
            <div className="ability">
                <div className="ability-name">CHA</div>
                <div>{monster.charisma} ({getAbilityModifier(monster.charisma)})</div>
            </div>
        </div>
    );
}

export default MonsterAbilityScores;
