import { useState, useEffect } from 'react';
import './Encounters.css';

// XP thresholds for each player level (0-20) and difficulty (Easy, Medium, Hard, Deadly)
const xpThresholds = [
    [  15,   25,   40,    50], // level 0 - For commoners
    [  25,   50,   75,   100], // level 1
    [  50,  100,  150,   200],
    [  75,  150,  225,   400],
    [ 125,  250,  375,   500],
    [ 250,  500,  750,  1100],
    [ 300,  600,  900,  1400],
    [ 350,  750, 1100,  1700],
    [ 450,  900, 1400,  2100],
    [ 550, 1100, 1600,  2400],
    [ 600, 1200, 1900,  2800],
    [ 800, 1600, 2400,  3600],
    [1000, 2000, 3000,  4500],
    [1100, 2200, 3400,  5100],
    [1250, 2500, 3800,  5700],
    [1400, 2800, 4300,  6400],
    [1600, 3200, 4800,  7200],
    [2000, 3900, 5900,  8800],
    [2100, 4200, 6300,  9500],
    [2400, 4900, 7300, 10900],
    [2800, 5700, 8500, 12700]  // level 20
];

// Difficulty labels
const difficultyLabels = ['Easy', 'Medium', 'Hard', 'Deadly'];

// Recommended monster counts for encounter scaling
const monsterCounts = ['1', '2', '3-6', '7-10', '11-14', '15+'];

function Encounters() {
    const [filter, setFilter] = useState({
        difficulty: 2, // Easy=0, Medium=1, Hard=2, Deadly=3
        playerLevels: [1]
    });

    const [encounterThresholds, setEncounterThresholds] = useState([0, 0, 0, 0, 0, 0]);

    // Load filter from localStorage on mount
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
            // Save default filter to localStorage
            localStorage.setItem('encounterFilter', JSON.stringify(filter));
        }
    }, []);

    // Calculate encounter thresholds whenever filter changes
    useEffect(() => {
        calculateThresholds(filter);
    }, [filter]);

    const calculateThresholds = (currentFilter) => {
        let xpThreshold = 0;
        currentFilter.playerLevels.forEach(pl => {
            const levelIndex = parseInt(pl);
            if (!isNaN(levelIndex) && levelIndex >= 0 && levelIndex <= 20) {
                xpThreshold += xpThresholds[levelIndex][currentFilter.difficulty];
            }
        });

        // Calculate recommended total monster XP for different monster counts
        const thresholds = [
            xpThreshold,                           // 1 monster
            Math.round(xpThreshold / 1.5),         // 2 monsters
            Math.round(xpThreshold / 2),           // 3-6 monsters
            Math.round(xpThreshold / 2.5),         // 7-10 monsters
            Math.round(xpThreshold / 3),           // 11-14 monsters
            Math.round(xpThreshold / 4)            // 15+ monsters
        ];

        setEncounterThresholds(thresholds);
    };

    const filterChanged = (newFilter) => {
        setFilter(newFilter);
        localStorage.setItem('encounterFilter', JSON.stringify(newFilter));
    };

    const addPlayer = () => {
        const newFilter = {
            ...filter,
            playerLevels: [...filter.playerLevels, 1]
        };
        filterChanged(newFilter);
    };

    const removePlayer = () => {
        if (filter.playerLevels.length > 1) {
            const newFilter = {
                ...filter,
                playerLevels: filter.playerLevels.slice(0, -1)
            };
            filterChanged(newFilter);
        }
    };

    const onPlayerLevelChange = (playerLevelIndex, newValue) => {
        const newLevels = [...filter.playerLevels];
        newLevels[playerLevelIndex] = newValue;
        const newFilter = { ...filter, playerLevels: newLevels };
        filterChanged(newFilter);
    };

    const onDifficultyChange = (event) => {
        const newFilter = {
            ...filter,
            difficulty: parseInt(event.target.value)
        };
        filterChanged(newFilter);
    };

    return (
        <>
            <form className="filter-form">
                {/* Difficulty */}
                <label htmlFor="difficulty" className="col-form-label">Difficulty</label>
                <select 
                    name="difficulty" 
                    id="difficulty"
                    className="form-control" 
                    value={filter.difficulty}
                    onChange={onDifficultyChange}
                >
                    {difficultyLabels.map((label, index) => (
                        <option key={index} value={index}>{label}</option>
                    ))}
                </select>

                {/* Player Level Buttons */}
                <div className="encounters-playerLevelButtons">
                    <button type="button" className="btn btn-primary" onClick={addPlayer}>Add Player</button>
                    <button type="button" className="btn btn-primary" onClick={removePlayer}>Remove Player</button>
                </div>

                {/* Player Level Inputs */}
                {filter.playerLevels.map((level, index) => (
                    <>
                        <label key={`label-${index}`} htmlFor={`player${index}`} className="col-form-label">Player {index + 1} Level</label>
                        <input 
                            key={`input-${index}`}
                            type="number" 
                            name={`player${index}`} 
                            className="encounters-column form-control"
                            value={level}
                            onChange={(e) => onPlayerLevelChange(index, e.target.value)}
                            min="1" 
                            max="20" 
                            step="1" 
                            placeholder="level"
                        />
                    </>
                ))}
            </form>

            {/* Encounter Thresholds Table */}
            <div className="list">
                <table className="encounters-table table-condensed table-striped table-hover">
                    <thead>
                        <tr>
                            <th className="col-form-label">Monsters</th>
                            <th className="col-form-label">Recommended Total<br />Monster XP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monsterCounts.map((count, index) => (
                            <tr key={index}>
                                <td>{count}</td>
                                <td>{encounterThresholds[index]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Encounters;
