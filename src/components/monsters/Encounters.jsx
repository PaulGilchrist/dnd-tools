import { useState, useEffect, useMemo } from 'react';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem, getVersionedStorageKey } from '../../utils/localStorage';
import { useRuleVersion } from '../../context/RuleVersionContext';
import { useVersionedData } from '../../hooks/useVersionedData';
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

// Extracted: Calculate XP threshold from player levels and difficulty
function calculateXPThreshold(filter) {
    let xpThreshold = 0;
    filter.playerLevels.forEach(pl => {
        const levelIndex = parseInt(pl);
        if (!isNaN(levelIndex) && levelIndex >= 0 && levelIndex <= 20) {
            xpThreshold += xpThresholds[levelIndex][filter.difficulty];
        }
    });
    return xpThreshold;
}

// Extracted: Calculate max XP for filtering
function calculateMaxXP(filter) {
    let maxXP = 0;
    filter.playerLevels.forEach(pl => {
        const levelIndex = parseInt(pl);
        if (!isNaN(levelIndex) && levelIndex >= 0 && levelIndex <= 20) {
            maxXP += xpThresholds[levelIndex][filter.difficulty];
        }
    });
    return maxXP * 2;
}

// Extracted: Calculate difficulty multiplier from monster count
function calculateDifficultyMultiplier(monsterCount) {
    if (monsterCount === 0) return 1;
    if (monsterCount === 1) return 1;
    if (monsterCount === 2) return 1.5;
    if (monsterCount <= 6) return 2;
    if (monsterCount <= 10) return 2.5;
    if (monsterCount <= 14) return 3;
    return 4;
}

// Extracted: Calculate difficulty index from effective XP and threshold
function calculateDifficultyIndex(effectiveXP, totalThreshold) {
    if (totalThreshold === 0) return 0;
    const ratio = effectiveXP / totalThreshold;
    if (ratio < 0.5) return 0;
    if (ratio < 1) return 1;
    if (ratio < 1.5) return 2;
    return 3;
}

// Extracted: Calculate total monster XP
function calculateTotalMonsterXP(selectedMonsters) {
    return selectedMonsters.reduce((sum, monster) => sum + (monster.xp || 0) * (monster.qty || 1), 0);
}

// Extracted: Calculate total monster count
function calculateMonsterCount(selectedMonsters) {
    return selectedMonsters.reduce((sum, monster) => sum + (monster.qty || 1), 0);
}

// Extracted: Filter monsters by max XP and search query
function filterMonsters(monstersData, searchQuery, filter) {
    if (!monstersData) return [];
    const maxXP = calculateMaxXP(filter);
    return monstersData.filter(monster => {
        if (monster.xp > maxXP) {
            return false;
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return monster.name.toLowerCase().includes(query) ||
                (monster.type && monster.type.toLowerCase().includes(query)) ||
                (monster.subtype && monster.subtype.toLowerCase().includes(query));
        }
        return true;
    });
}

// Extracted: Toggle monster selection
function toggleMonster(selectedMonsters, monster) {
    if (selectedMonsters.some(m => m.index === monster.index)) {
        return selectedMonsters.map(m =>
            m.index === monster.index ? { ...m, qty: (m.qty || 1) - 1 } : m
        ).filter(m => (m.qty || 1) > 0);
    }
    return [...selectedMonsters, { ...monster, qty: 1 }];
}

// Extracted: Update monster quantity
function updateQty(selectedMonsters, monsterIndex, delta) {
    return selectedMonsters.map(m =>
        m.index === monsterIndex ? { ...m, qty: (m.qty || 1) + delta } : m
    ).filter(m => (m.qty || 1) > 0);
}

// Extracted: Player management
function updatePlayerLevels(filter, playerLevels) {
    return { ...filter, playerLevels };
}

// Extracted: Update filter and save to localStorage
function updateFilterAndSave(newFilter, ruleVersion) {
    const versionedFilterKey = getVersionedStorageKey(LOCAL_STORAGE_KEYS.ENCOUNTER_FILTER, ruleVersion);
    setLocalStorageItem(versionedFilterKey, newFilter);
    return newFilter;
}

function Encounters() {
    const { ruleVersion } = useRuleVersion();
    const { data: monstersData, loading: monstersLoading } = useVersionedData('monsters');

    const [filter, setFilter] = useState({
        difficulty: 2,
        playerLevels: [1]
    });

    const [selectedMonsters, setSelectedMonsters] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const versionedFilterKey = getVersionedStorageKey(LOCAL_STORAGE_KEYS.ENCOUNTER_FILTER, ruleVersion);
        const savedFilter = getLocalStorageItem(versionedFilterKey);
        if (savedFilter) {
            try {
                setFilter(savedFilter);
            } catch (e) {
                console.error('Error parsing saved encounter filter:', e);
            }
        } else {
            setLocalStorageItem(versionedFilterKey, filter);
        }
    }, [ruleVersion]);

    const totalThreshold = useMemo(() => calculateXPThreshold(filter), [filter.playerLevels, filter.difficulty]);
    const totalMonsterXP = useMemo(() => calculateTotalMonsterXP(selectedMonsters), [selectedMonsters]);
    const monsterCount = useMemo(() => calculateMonsterCount(selectedMonsters), [selectedMonsters]);
    const difficultyMultiplier = useMemo(() => calculateDifficultyMultiplier(monsterCount), [monsterCount]);
    const effectiveXP = Math.round(totalMonsterXP / difficultyMultiplier);
    const difficultyIndex = useMemo(() => calculateDifficultyIndex(effectiveXP, totalThreshold), [effectiveXP, totalThreshold]);
    const filteredMonsters = useMemo(() => filterMonsters(monstersData, searchQuery, filter), [monstersData, searchQuery, filter.playerLevels, filter.difficulty]);

    const toggleMonsterHandler = (monster) => {
        setSelectedMonsters(prev => toggleMonster(prev, monster));
    };

    const increaseQty = (monsterIndex) => {
        setSelectedMonsters(prev => updateQty(prev, monsterIndex, 1));
    };

    const decreaseQty = (monsterIndex) => {
        setSelectedMonsters(prev => updateQty(prev, monsterIndex, -1));
    };

    const removeMonster = (monsterIndex) => {
        setSelectedMonsters(prev => prev.filter(m => m.index !== monsterIndex));
    };

    const clearMonsters = () => {
        setSelectedMonsters([]);
    };

    const updateFilter = (newFilter) => {
        setFilter(newFilter);
        updateFilterAndSave(newFilter, ruleVersion);
    };

    const addPlayer = () => {
        updateFilter(updatePlayerLevels(filter, [...filter.playerLevels, 1]));
    };

    const removePlayer = (playerIndex) => {
        const newLevels = filter.playerLevels.filter((_, i) => i !== playerIndex);
        if (newLevels.length > 0) {
            updateFilter(updatePlayerLevels(filter, newLevels));
        }
    };

    const onPlayerLevelChange = (playerLevelIndex, newValue) => {
        const newLevels = [...filter.playerLevels];
        newLevels[playerLevelIndex] = newValue;
        updateFilter(updatePlayerLevels(filter, newLevels));
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
                    onToggleMonster={toggleMonsterHandler}
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
