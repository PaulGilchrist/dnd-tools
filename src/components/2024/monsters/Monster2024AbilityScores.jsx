import { useState } from 'react';

/**
 * Monster2024AbilityScores component - Displays monster ability scores and modifiers
 * @param {object} monster - The monster data object with ability_scores and ability_score_modifiers
 */
function Monster2024AbilityScores({ monster }) {
    if (!monster || !monster.ability_scores) {
        return null;
    }

    const abilities = [
        { key: 'str', name: 'STR' },
        { key: 'dex', name: 'DEX' },
        { key: 'con', name: 'CON' },
        { key: 'int', name: 'INT' },
        { key: 'wis', name: 'WIS' },
        { key: 'cha', name: 'CHA' }
    ];

    return (
        <div className="abilities">
            {abilities.map((ability) => {
                const score = monster.ability_scores[ability.key];
                const modifier = monster.ability_score_modifiers?.[ability.key] || 0;
                return (
                    <div key={ability.key} className="ability">
                        <div className="ability-name">{ability.name}</div>
                        <div>{score} ({modifier > 0 ? '+' : ''}{modifier})</div>
                    </div>
                );
            })}
        </div>
    );
}

export default Monster2024AbilityScores;