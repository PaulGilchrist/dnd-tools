import React from 'react';

/**
 * Monster table for selecting monsters in the encounter builder
 */
function EncounterMonsterTable({ filteredMonsters, selectedMonsters, onToggleMonster, onIncreaseQty, onDecreaseQty, onRemoveMonster, searchQuery, onSearchQueryChange }) {
    return (
            <div className="encounters-monsters">
                <div className="input-group input-group-sm mb-2">
                    <span className="input-group-text">Search</span>
                    <input 
                       type="text" 
                       className="form-control" 
                       placeholder="Name, type, or subtype..."
                       value={searchQuery}
                       onChange={(e) => onSearchQueryChange(e.target.value)}
                    />
                </div>
               
                {filteredMonsters.length > 0 && (
                    <div className="monster-table-wrapper">
                        <table className="monster-table">
                             <thead>
                                 <tr>
                                     <th className="col-select">Select</th>
                                     <th className="col-name">Monster</th>
                                     <th className="col-cr">CR</th>
                                     <th className="col-xp">XP</th>
                                     <th className="col-qty">Qty</th>
                                     <th className="col-remove"></th>
                                 </tr>
                              </thead>
                            <tbody>
                                {filteredMonsters.map((monster) => {
                                   const selected = selectedMonsters.find(m => m.index === monster.index);
                                   const qty = selected ? (selected.qty || 1) : 0;
                                   return (
                                        <tr 
                                          key={monster.index}
                                          className={`monster-row ${qty > 0 ? 'selected' : ''}`}
                                          onClick={() => onToggleMonster(monster)}
                                        >
                                            <td className="col-select">
                                                <input 
                                                  type="checkbox" 
                                                  checked={qty > 0}
                                                  onChange={() => onToggleMonster(monster)}
                                                  onClick={(e) => e.stopPropagation()}
                                                />
                                            </td>
                                            <td className="col-name">{monster.name}</td>
                                            <td className="col-cr">{monster.challenge_rating}</td>
                                            <td className="col-xp">{monster.xp}</td>
                                            <td className="col-qty">
                                                {qty > 0 && (
                                                    <div className="qty-controls">
                                                        <button 
                                                          type="button" 
                                                          className="btn btn-sm btn-outline-secondary qty-btn" 
                                                          onClick={(e) => {
                                                              e.stopPropagation();
                                                              onDecreaseQty(monster.index);
                                                             }}
                                                         >−</button>
                                                        <span className="qty-value">{qty}</span>
                                                        <button 
                                                          type="button" 
                                                          className="btn btn-sm btn-outline-secondary qty-btn" 
                                                          onClick={(e) => {
                                                              e.stopPropagation();
                                                              onIncreaseQty(monster.index);
                                                             }}
                                                         >+</button>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="col-remove">
                                                <button 
                                                  type="button" 
                                                  className="btn btn-sm btn-link text-danger p-0" 
                                                  onClick={(e) => {
                                                      e.stopPropagation();
                                                      onRemoveMonster(monster.index);
                                                     }}
                                                 >×</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                       
                    </div>
                )}
               
                {filteredMonsters.length === 0 && (
                    <div className="text-center text-muted py-3">No monsters found</div>
                )}
            </div>
        );
}

export default EncounterMonsterTable;