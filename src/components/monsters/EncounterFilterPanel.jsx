import React from 'react';

function getDifficultyColorClass(index) {
    return `difficulty-color-${Math.max(0, Math.min(3, index ?? 0))}`;
}

/**
 * Filter panel for the Encounter Builder
 * Handles difficulty selection and player level management
 */
function EncounterFilterPanel({ filter, onDifficultyChange, onAddPlayer, onRemovePlayer, onPlayerLevelChange }) {
    return (
          <div className="encounters-filters-side">
              <div className="form-group">
                  <label htmlFor="difficulty" className="small-label">Difficulty</label>
                  <select 
                      id="difficulty"
                      className="form-control form-control-sm" 
                      value={filter.difficulty ?? ''}
                      onChange={onDifficultyChange}
                  >
                    {filter.difficultyLabels && filter.difficultyLabels.map((label, index) => (
                        <option key={label} value={index}>{label}</option>
                      ))}
                  </select>
              </div>
              <div className="form-group">
                  <button type="button" className="btn btn-sm btn-outline-secondary mb-2" onClick={onAddPlayer}>+ Add Player</button>
                  <div className="player-levels-horizontal">
                      {filter.playerLevels.map((player, index) => (
                            <div key={player.id} className="player-level-row">
                              <span className="player-level-label">Player {index + 1} Level</span>
                              <input 
                                  type="number" 
                                  className="player-level-input"
                                  value={player.level}
                                  onChange={(e) => onPlayerLevelChange(player.id, e.target.value)}
                                  min="1" 
                                  max="20" 
                              />
                              <button 
                                  type="button" 
                                  className="btn btn-sm btn-outline-danger level-delete-btn" 
                                  onClick={() => onRemovePlayer(player.id)}
                                  disabled={filter.playerLevels.length <= 1}
                                  title="Remove player"
                              >×</button>
                          </div>
                      ))}
                  </div>
              </div>
              <div className="threshold-mini">
                  <span>Target: <strong className={getDifficultyColorClass(filter.difficultyIndex)}>{filter.totalThreshold} XP</strong></span>
                  <span className="text-muted">({filter.difficultyLabels[filter.difficultyIndex]})</span>
              </div>
          </div>
      );
}

export default EncounterFilterPanel;