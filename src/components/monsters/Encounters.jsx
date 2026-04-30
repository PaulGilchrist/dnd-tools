import { useState, useEffect, useMemo } from 'react';
import { useMonsters } from '../../data/dataService';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem } from '../../utils/localStorage';
import Loading from './Loading';
import EncounterFilterPanel from './EncounterFilterPanel';
import EncounterSummaryPanel from './EncounterSummaryPanel';
import EncounterMonsterTable from './EncounterMonsterTable';
import EncounterSelectedMonsters from './EncounterSelectedMonsters';
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
        const savedFilter = getLocalStorageItem(LOCAL_STORAGE_KEYS.ENCOUNTER_FILTER);
        if (savedFilter) {
            try {
                setFilter(savedFilter);
            } catch (e) {
                console.error('Error parsing saved encounter filter:', e);
            }
        } else {
            setLocalStorageItem(LOCAL_STORAGE_KEYS.ENCOUNTER_FILTER, filter);
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

    const toggleMonster = (monster) => {
        if (selectedMonsters.some(m => m.index === monster.index)) {
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
        setLocalStorageItem(LOCAL_STORAGE_KEYS.ENCOUNTER_FILTER, newFilter);
    };

    const addPlayer = () => {
        updateFilter({ ...filter, playerLevels: [...filter.playerLevels, 1] });
    };

    const removePlayer = (playerIndex) => {
        const newLevels = filter.playerLevels.filter((_, i) => i !== playerIndex);
        if (newLevels.length > 0) {
            updateFilter({ ...filter, playerLevels: newLevels });
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
                     <EncounterFilterPanel
                        filter={{
                            ...filter,
                            difficultyLabels,
                            difficultyColors,
                            difficultyIndex,
                            totalThreshold
                        }}
                        onDifficultyChange={onDifficultyChange}
                        onAddPlayer={addPlayer}
                        onRemovePlayer={removePlayer}
                        onPlayerLevelChange={onPlayerLevelChange}
                     />
                     <EncounterSummaryPanel
                        totalMonsterXP={totalMonsterXP}
                        monsterCount={monsterCount}
                        difficultyMultiplier={difficultyMultiplier}
                        effectiveXP={effectiveXP}
                        difficultyIndex={difficultyIndex}
                        difficultyLabels={difficultyLabels}
                        difficultyColors={difficultyColors}
                        selectedMonsters={selectedMonsters}
                        onClearMonsters={clearMonsters}
                                                        />
                                                    </div>
            {/* Monster Selection */}
                 <EncounterMonsterTable
                    filteredMonsters={filteredMonsters}
                    selectedMonsters={selectedMonsters}
                    onToggleMonster={toggleMonster}
                    onIncreaseQty={increaseQty}
                    onDecreaseQty={decreaseQty}
                    onRemoveMonster={removeMonster}
                    searchQuery={searchQuery}
                    onSearchQueryChange={setSearchQuery}
                    />
            {/* Selected Monsters Detail */}
                 <EncounterSelectedMonsters
                    selectedMonsters={selectedMonsters}
                    onRemoveMonster={removeMonster}
                 />
                            </div>
                    </div>
     );
}

export default Encounters;

