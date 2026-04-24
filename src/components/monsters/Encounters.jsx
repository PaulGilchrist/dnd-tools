import { useState, useEffect, useMemo } from 'react';
import { useMonsters } from '../../data/dataService';
import Loading from './Loading';
import './Encounters.css';

const xpThresholds = [
    [15, 25, 40, 50], [25, 50, 75, 100], [50, 100, 150, 200],
    [75, 150, 225, 400], [125, 250, 375, 500], [250, 500, 750, 1100],
    [300, 600, 900, 1400], [350, 750, 1100, 1700], [450, 900, 1400, 2100],
    [550, 1100, 1600, 2400], [600, 1200, 1900, 2800], [800, 1600, 2400, 3600],
    [1000, 2000, 3000, 4500], [1100, 2200, 3400, 5100], [1250, 2500, 3800, 5700],
    [1400, 2800, 4300, 6400], [1600, 3200, 4800, 7200], [2000, 3900, 5900, 8800],
    [2100, 4200, 6300, 9500], [2400, 4900, 7300, 10900], [2800, 5700, 8500, 12700]
];

const difficultyLabels = ['Easy', 'Medium', 'Hard', 'Deadly'];
const difficultyColors = ['#28a745', '#ffc107', '#fd7e14', '#dc3545'];

function Encounters() {
    const { data: monstersData, loading: monstersLoading } = useMonsters();
    
    const [filter, setFilter] = useState({
        difficulty: 2,
        playerLevels: [1]
    });

    const [selectedMonsters, setSelectedMonsters] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const savedFilter = localStorage.getItem('encounterFilter');
        if (savedFilter) {
            try {
                const parsedFilter = JSON.parse(savedFilter);
                setFilter(parsedFilter);
            } catch (e) {
                console.error('Error parsing saved encounter filter:', e);
            }
        } else {
            localStorage.setItem('encounterFilter', JSON.stringify(filter));
        }
    }, []);

    const totalThreshold = useMemo(() => {
        let xpThreshold = 0;
        filter.playerLevels.forEach(pl => {
            const levelIndex = parseInt(pl);
            if (!isNaN(levelIndex) && levelIndex >= 0 && levelIndex <= 20) {
                xpThreshold += xpThresholds[levelIndex][filter.difficulty];
            }
        });
        return xpThreshold;
    }, [filter.playerLevels, filter.difficulty]);

        const totalMonsterXP = useMemo(() => {
        return selectedMonsters.reduce((sum, monster) => sum + (monster.xp || 0) * (monster.qty || 1), 0);
     }, [selectedMonsters]);

    const monsterCount = selectedMonsters.reduce((sum, monster) => sum + (monster.qty || 1), 0);
    const difficultyMultiplier = useMemo(() => {
        if (monsterCount === 0) return 1;
        if (monsterCount === 1) return 1;
        if (monsterCount === 2) return 1.5;
        if (monsterCount <= 6) return 2;
        if (monsterCount <= 10) return 2.5;
        if (monsterCount <= 14) return 3;
        return 4;
    }, [monsterCount]);

    const effectiveXP = Math.round(totalMonsterXP / difficultyMultiplier);
    const difficultyIndex = useMemo(() => {
        if (totalThreshold === 0) return 0;
        const ratio = effectiveXP / totalThreshold;
        if (ratio < 0.5) return 0;
        if (ratio < 1) return 1;
        if (ratio < 1.5) return 2;
        return 3;
    }, [effectiveXP, totalThreshold]);

    const filteredMonsters = useMemo(() => {
        if (!monstersData) return [];
        
        // Calculate the max XP threshold (2x the selected difficulty threshold)
        let maxXP = 0;
        filter.playerLevels.forEach(pl => {
            const levelIndex = parseInt(pl);
            if (!isNaN(levelIndex) && levelIndex >= 0 && levelIndex <= 20) {
                maxXP += xpThresholds[levelIndex][filter.difficulty];
            }
        });
        maxXP *= 2;
        
        // Always filter from the full monster list, not a previously filtered list
        let result = monstersData.filter(monster => {
            // Filter out monsters more than double the recommended difficulty
            if (monster.xp > maxXP) {
                return false;
            }
            
            // Apply search query filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return monster.name.toLowerCase().includes(query) ||
                    (monster.type && monster.type.toLowerCase().includes(query)) ||
                    (monster.subtype && monster.subtype.toLowerCase().includes(query));
            }
            
            return true;
        });
        
        return result;
    }, [monstersData, searchQuery, filter.playerLevels, filter.difficulty]);

    const isSelected = (monsterIndex) => {
        return selectedMonsters.some(m => m.index === monsterIndex);
    };

    const toggleMonster = (monster) => {
        if (isSelected(monster.index)) {
            // If already selected, decrease quantity or remove if qty is 1
            setSelectedMonsters(selectedMonsters.map(m => 
                m.index === monster.index ? { ...m, qty: (m.qty || 1) - 1 } : m
            ).filter(m => (m.qty || 1) > 0));
        } else {
            // Add new monster with qty 1
            setSelectedMonsters([...selectedMonsters, { ...monster, qty: 1 }]);
        }
    };

    const increaseQty = (monsterIndex) => {
        setSelectedMonsters(selectedMonsters.map(m => 
            m.index === monsterIndex ? { ...m, qty: (m.qty || 1) + 1 } : m
        ));
    };

    const decreaseQty = (monsterIndex) => {
        setSelectedMonsters(selectedMonsters.map(m => 
            m.index === monsterIndex ? { ...m, qty: (m.qty || 1) - 1 } : m
        ).filter(m => (m.qty || 1) > 0));
    };

    const removeMonster = (monsterIndex) => {
        setSelectedMonsters(selectedMonsters.filter(m => m.index !== monsterIndex));
    };

    const clearMonsters = () => {
        setSelectedMonsters([]);
    };

    const updateFilter = (newFilter) => {
        setFilter(newFilter);
        localStorage.setItem('encounterFilter', JSON.stringify(newFilter));
    };

    const addPlayer = () => {
        updateFilter({ ...filter, playerLevels: [...filter.playerLevels, 1] });
    };

    const removePlayer = () => {
        if (filter.playerLevels.length > 1) {
            updateFilter({ ...filter, playerLevels: filter.playerLevels.slice(0, -1) });
        }
    };

    const onPlayerLevelChange = (playerLevelIndex, newValue) => {
        const newLevels = [...filter.playerLevels];
        newLevels[playerLevelIndex] = newValue;
        updateFilter({ ...filter, playerLevels: newLevels });
    };

    const onDifficultyChange = (event) => {
        updateFilter({ ...filter, difficulty: parseInt(event.target.value) });
    };

    if (monstersLoading) {
        return <Loading />;
    }

    return (
        <div className="container">
            <h2 className="encounters-title">Encounter Builder</h2>
            <div className="encounters-compact">
                {/* Top Row: Filters + Summary */}
                <div className="encounters-top">
                {/* Left: Filters */}
                <div className="encounters-filters-side">
                    <div className="form-group">
                        <label htmlFor="difficulty" className="small-label">Difficulty</label>
                        <select 
                            id="difficulty"
                            className="form-control form-control-sm" 
                            value={filter.difficulty}
                            onChange={onDifficultyChange}
                        >
                            {difficultyLabels.map((label, index) => (
                                <option key={index} value={index}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                                            <button type="button" className="btn btn-sm btn-outline-secondary mb-2" onClick={addPlayer}>+ Add Player</button>
                                            <div className="player-levels-horizontal">
                                                {filter.playerLevels.map((level, index) => (
                                                    <div key={index} className="player-level-row">
                                                        <span className="player-level-label">Player {index + 1} Level</span>
                                                        <input 
                                                          type="number" 
                                                          className="player-level-input"
                                                          value={level}
                                                          onChange={(e) => onPlayerLevelChange(index, e.target.value)}
                                                          min="1" 
                                                          max="20" 
                                                        />
                                                        <button 
                                                            type="button" 
                                                            className="btn btn-sm btn-outline-danger level-delete-btn" 
                                                            onClick={() => {
                                                                const newLevels = filter.playerLevels.filter((_, i) => i !== index);
                                                                if (newLevels.length > 0) {
                                                                    updateFilter({ ...filter, playerLevels: newLevels });
                                                                 }
                                                             }}
                                                            disabled={filter.playerLevels.length <= 1}
                                                            title="Remove player"
                                                        >×</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                    <div className="threshold-mini">
                        <span>Target: <strong style={{ color: difficultyColors[difficultyIndex] }}>{totalThreshold} XP</strong></span>
                        <span className="text-muted">({difficultyLabels[difficultyIndex]})</span>
                    </div>
                </div>

                {/* Right: Selected Monsters Summary */}
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
                        <button type="button" className="btn btn-sm btn-warning w-100" onClick={clearMonsters}>Clear All</button>
                    )}
                </div>
            </div>

            {/* Monster Selection */}
            <div className="encounters-monsters">
                <div className="input-group input-group-sm mb-2">
                    <span className="input-group-text">Search</span>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Name, type, or subtype..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                                           onClick={() => toggleMonster(monster)}
                                        >
                                            <td className="col-select">
                                                <input 
                                                   type="checkbox" 
                                                   checked={qty > 0}
                                                   onChange={() => toggleMonster(monster)}
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
                                                               decreaseQty(monster.index);
                                                             }}
                                                        >−</button>
                                                        <span className="qty-value">{qty}</span>
                                                        <button 
                                                           type="button" 
                                                           className="btn btn-sm btn-outline-secondary qty-btn" 
                                                           onClick={(e) => {
                                                               e.stopPropagation();
                                                               increaseQty(monster.index);
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
                                                       removeMonster(monster.index);
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

            {/* Selected Monsters Detail */}
            {selectedMonsters.length > 0 && (
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
                                    onClick={() => removeMonster(monster.index)}
                                >×</button>
                            </div>
                        ))}
                    </div>
                 </div>
             )}
         </div>
         </div>
     );
}

export default Encounters;
