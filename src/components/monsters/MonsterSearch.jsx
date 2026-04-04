import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useMonsters } from '../../data/dataService';
import Monster from './Monster';

// Javascript utilities (matching Angular)
const utils = {
    scrollIntoView: function(index) {
        const element = document.getElementById(index);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
};

function MonsterSearch() {
    const [monsters, setMonsters] = useState([]);
    const [filter, setFilter] = useState({
        bookmarked: 'All',
        challengeRatingMin: 0,
        challengeRatingMax: 25,
        environment: 'All',
        name: '',
        size: 'All',
        type: 'All',
        xpMin: 0,
        xpMax: 50000,
    });
    const [shownCard, setShownCard] = useState('');
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: monstersData, loading: monstersLoading } = useMonsters();

    useEffect(() => {
        if (monstersData && monstersData.length > 0) {
            setMonsters(monstersData);
            console.log(`${monstersData.length} monsters`);

            const index = searchParams.get('index');
            if (index) {
                const monster = monstersData.find((monster) => monster.index === index);
                if (monster) {
                    setShownCard(index);
                    utils.scrollIntoView(monster.index);
                }
            } else {
                // Set search filters from localStorage, only defaulting to "All" when there's no saved data
                const savedFilter = localStorage.getItem('monsterFilter');
                if (savedFilter) {
                    setFilter(JSON.parse(savedFilter));
                } else {
                    localStorage.setItem('monsterFilter', JSON.stringify(filter));
                }
            }

            // Set bookmarked monsters from localStorage
            const monstersBookmarkedJson = localStorage.getItem('monstersBookmarked');
            let monstersBookmarked = [];
            if (monstersBookmarkedJson) {
                monstersBookmarked = JSON.parse(monstersBookmarkedJson);
            }

            // Update bookmarked status for each monster
            const updatedMonsters = monstersData.map(monster => ({
                ...monster,
                bookmarked: monstersBookmarked.includes(monster.index)
            }));
            setMonsters(updatedMonsters);
        }
    }, [monstersData]);

    const expandCard = (index, expanded) => {
        if (expanded) {
            setShownCard(index);
            utils.scrollIntoView(index);
        }

        // Update URL query params using setSearchParams
        if (expanded) {
            setSearchParams({ index });
        } else {
            setSearchParams({});
        }
    };

    const filterChanged = (newFilter) => {
        localStorage.setItem('monsterFilter', JSON.stringify(newFilter));
    };

    const saveBookmark = () => {
        const monstersBookmarked = monsters
            .filter(monster => monster.bookmarked)
            .map(monster => monster.index);
        localStorage.setItem('monstersBookmarked', JSON.stringify(monstersBookmarked));
    };

    const showMonster = (monster) => {
        // Bookmarked filter
        if (filter.bookmarked !== 'All' && !monster.bookmarked) {
            return false;
        }
        // Challenge Range
        if (monster.challenge_rating < filter.challengeRatingMin || monster.challenge_rating > filter.challengeRatingMax) {
            return false;
        }
        // Environment filter
        if (filter.environment !== 'All' && (!monster.environments || !monster.environments.includes(filter.environment))) {
            return false;
        }
        // Name filter
        if (filter.name !== '' && !monster.name.toLowerCase().includes(filter.name.toLowerCase())) {
            return false;
        }
        // Size filter
        if (filter.size !== 'All' && filter.size !== monster.size) {
            return false;
        }
        // Type filter
        if (filter.type !== 'All' && filter.type !== monster.type) {
            return false;
        }
        // XP
        if (monster.xp < filter.xpMin || monster.xp > filter.xpMax) {
            return false;
        }
        return true;
    };

    const handleBookmarkChange = (index, isBookmarked) => {
        // Update local state immediately so UI reflects the change
        setMonsters(prevMonsters => 
            prevMonsters.map(monster => 
                monster.index === index ? { ...monster, bookmarked: isBookmarked } : monster
            )
        );
        
        // Save to localStorage - get current bookmarked items from state
        const monstersBookmarked = monsters
            .filter(monster => monster.bookmarked)
            .map(monster => monster.index);
        
        if (isBookmarked) {
            // Add to bookmarked list
            monstersBookmarked.push(index);
        } else {
            // Remove from bookmarked list
            const filtered = monstersBookmarked.filter(i => i !== index);
            localStorage.setItem('monstersBookmarked', JSON.stringify(filtered));
        }
        
        if (isBookmarked) {
            localStorage.setItem('monstersBookmarked', JSON.stringify(monstersBookmarked));
        }
    };

    if (monstersLoading) {
        return <div className="list"><div>Loading monsters...</div></div>;
    }

    const filteredMonsters = monsters.filter(showMonster);

    return (
        <>
            <form className="filter-form">
                {/* Name */}
                <label htmlFor="name" className="col-form-label">Name</label>
                <div className={`has-error ${filter.name && filter.name.length >= 50 ? 'invalid' : ''}`}>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="name" 
                        name="name"
                        value={filter.name}
                        onChange={(e) => {
                            const newFilter = { ...filter, name: e.target.value };
                            setFilter(newFilter);
                            filterChanged(newFilter);
                        }}
                        pattern="[A-Za-z ]+" 
                        maxLength="50"
                    />
                    {filter.name && filter.name.length >= 50 && (
                        <div className="alert alert-danger">
                            Name should be less than 50 characters
                        </div>
                    )}
                </div>

                {/* Challenge Rating */}
                <label htmlFor="challengeRatingMin" className="col-form-label">Challenge Rating</label>
                <div className="row">
                    <div className="col">
                        <input 
                            type="number" 
                            className="column form-control" 
                            id="challengeRatingMin" 
                            name="challengeRatingMin"
                            value={filter.challengeRatingMin}
                            onChange={(e) => {
                                const newFilter = { ...filter, challengeRatingMin: parseFloat(e.target.value) || 0 };
                                setFilter(newFilter);
                                filterChanged(newFilter);
                            }}
                            min="0" 
                            max="25" 
                            step="0.25" 
                            placeholder="min"
                        />
                    </div>
                    <div className="col">
                        <input 
                            type="number" 
                            className="column form-control" 
                            id="challengeRatingMax" 
                            name="challengeRatingMax"
                            value={filter.challengeRatingMax}
                            onChange={(e) => {
                                const newFilter = { ...filter, challengeRatingMax: parseFloat(e.target.value) || 0 };
                                setFilter(newFilter);
                                filterChanged(newFilter);
                            }}
                            min="0" 
                            max="25" 
                            step="0.25" 
                            placeholder="max"
                        />
                    </div>
                </div>

                {/* XP */}
                <label htmlFor="xpMin" className="col-form-label">XP</label>
                <div className="row">
                    <div className="col">
                        <input 
                            type="number" 
                            className="column form-control" 
                            id="xpMin" 
                            name="xpMin"
                            value={filter.xpMin}
                            onChange={(e) => {
                                const newFilter = { ...filter, xpMin: parseInt(e.target.value) || 0 };
                                setFilter(newFilter);
                                filterChanged(newFilter);
                            }}
                            min="0" 
                            max="50000" 
                            step="25" 
                            placeholder="min"
                        />
                    </div>
                    <div className="col">
                        <input 
                            type="number" 
                            className="column form-control" 
                            id="xpMax" 
                            name="xpMax"
                            value={filter.xpMax}
                            onChange={(e) => {
                                const newFilter = { ...filter, xpMax: parseInt(e.target.value) || 0 };
                                setFilter(newFilter);
                                filterChanged(newFilter);
                            }}
                            min="0" 
                            max="50000" 
                            step="25" 
                            placeholder="max"
                        />
                    </div>
                </div>

                {/* Environment */}
                <label htmlFor="environment" className="col-form-label">Environment</label>
                <select 
                    name="environment" 
                    className="form-control"
                    value={filter.environment}
                    onChange={(e) => {
                        const newFilter = { ...filter, environment: e.target.value };
                        setFilter(newFilter);
                        filterChanged(newFilter);
                    }}
                >
                    <option>All</option>
                    <option value="arctic">Arctic</option>
                    <option value="coastal">Coastal</option>
                    <option value="desert">Desert</option>
                    <option value="forest">Forest</option>
                    <option value="grassland">Grassland</option>
                    <option value="hill">Hill</option>
                    <option value="mountain">Mountain</option>
                    <option value="swamp">Swamp</option>
                    <option value="underdark">Underdark</option>
                    <option value="underwater">Underwater</option>
                    <option value="urban">Urban</option>
                </select>

                {/* Type */}
                <label htmlFor="type" className="col-form-label">Type</label>
                <select 
                    name="type" 
                    className="form-control"
                    value={filter.type}
                    onChange={(e) => {
                        const newFilter = { ...filter, type: e.target.value };
                        setFilter(newFilter);
                        filterChanged(newFilter);
                    }}
                >
                    <option>All</option>
                    <option value="aberration">Aberration</option>
                    <option value="beast">Beast</option>
                    <option value="celestial">Celestial</option>
                    <option value="construct">Construct</option>
                    <option value="dragon">Dragon</option>
                    <option value="elemental">Elemental</option>
                    <option value="fey">Fey</option>
                    <option value="fiend">Fiend</option>
                    <option value="giant">Giant</option>
                    <option value="humanoid">Humanoid</option>
                    <option value="monstrosity">Monstrosity</option>
                    <option value="ooze">Ooze</option>
                    <option value="plant">Plant</option>
                    <option value="undead">Undead</option>
                </select>

                {/* Size */}
                <label htmlFor="size" className="col-form-label">Size</label>
                <select 
                    name="size" 
                    className="form-control"
                    value={filter.size}
                    onChange={(e) => {
                        const newFilter = { ...filter, size: e.target.value };
                        setFilter(newFilter);
                        filterChanged(newFilter);
                    }}
                >
                    <option>All</option>
                    <option>Tiny</option>
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                    <option>Huge</option>
                    <option>Gargantuan</option>
                </select>

                {/* Bookmarked */}
                <label htmlFor="bookmarked" className="col-form-label">Bookmarked</label>
                <select 
                    name="bookmarked" 
                    className="form-control"
                    value={filter.bookmarked}
                    onChange={(e) => {
                        const newFilter = { ...filter, bookmarked: e.target.value };
                        setFilter(newFilter);
                        filterChanged(newFilter);
                    }}
                >
                    <option>All</option>
                    <option>Bookmarked</option>
                </select>
            </form>

            {/* Monsters List */}
            <div className="list">
                {filteredMonsters.map((monster) => (
                    <div key={monster.index} id={monster.index}>
                        {showMonster(monster) && (
                            <Monster 
                                monster={monster}
                                expand={shownCard === monster.index}
                                onExpand={(expanded) => expandCard(monster.index, expanded)}
                                onBookmarkChange={handleBookmarkChange}
                            />
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}

export default MonsterSearch;
