/**
 * Common MonsterAbilityScores component - Displays monster ability scores and modifiers
 * Works with normalized monster data from both 5e and 2024 versions
 * @param {object} monster - The normalized monster data object with abilityScores and abilityScoreModifiers
 */
function MonsterAbilityScores({ monster }) {
    if (!monster || !monster.abilityScores) {
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
                const score = monster.abilityScores[ability.key];
                const modifier = monster.abilityScoreModifiers?.[ability.key] || 0;
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

export default MonsterAbilityScores;