import React from 'react';

/**
 * Selected monsters detail list
 */
function EncounterSelectedMonsters({ selectedMonsters, onRemoveMonster }) {
    if (!selectedMonsters || selectedMonsters.length === 0) {
        return null;
      }

    return (
             <div className="encounters-selected-detail">
                 <h6>Selected Monsters ({selectedMonsters.length})</h6>
                 <div className="selected-list">
                     {selectedMonsters.map((monster) => (
                         <div key={monster.index} className="selected-item">
                             <span className="selected-name">{monster.name}</span>
                             <span className="selected-cr">CR {monster.challenge_rating}</span>
                             <span className="selected-xp">{monster.xp} XP</span>
                             <button 
                                type="button" 
                                className="btn btn-sm btn-link text-danger p-0" 
                                onClick={() => onRemoveMonster(monster.index)}
                             >×</button>
                         </div>
                     ))}
                 </div>
              </div>
          );
}

export default EncounterSelectedMonsters;