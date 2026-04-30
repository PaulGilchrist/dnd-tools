import React from 'react';

/**
 * Summary panel showing encounter stats
 */
function EncounterSummaryPanel({ totalMonsterXP, monsterCount, difficultyMultiplier, effectiveXP, difficultyIndex, difficultyLabels, difficultyColors, selectedMonsters, onClearMonsters }) {
    return (
           <div className="encounters-summary-side">
               <div className="summary-stats">
                   <div className="stat-item">
                       <span className="stat-label">Total XP</span>
                       <span className="stat-value"> {totalMonsterXP}</span>
                   </div>
                   <div className="stat-item">
                       <span className="stat-label">Monsters</span>
                       <span className="stat-value"> {monsterCount}</span>
                   </div>
                   <div className="stat-item">
                       <span className="stat-label">Multiplier</span>
                       <span className="stat-value"> ×{difficultyMultiplier}</span>
                   </div>
                   <div className="stat-item stat-item-main">
                       <span className="stat-label">Effective</span>
                       <span className="stat-value" style={{ color: difficultyColors[difficultyIndex] }}> {effectiveXP}</span>
                   </div>
                   <div className="stat-item stat-item-main">
                       <span className="stat-label">Difficulty</span>
                       <span className="stat-value" style={{ color: difficultyColors[difficultyIndex] }}> {difficultyLabels[difficultyIndex]}</span>
                   </div>
               </div>
               {selectedMonsters.length > 0 && (
                   <button type="button" className="btn btn-sm btn-warning w-100" onClick={onClearMonsters}>Clear All</button>
               )}
           </div>
       );
}

export default EncounterSummaryPanel;