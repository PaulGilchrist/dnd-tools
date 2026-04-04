import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useSpells } from '../../data/dataService';
import Spell from './Spell';
import SpellFilter from './SpellFilter';
import './Spells.css';

// Javascript utilities (matching Angular)
const utils = {
    scrollIntoView: function(index) {
        const element = document.getElementById(index);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
};

function Spells() {
    const [spells, setSpells] = useState([]);
    const [filter, setFilter] = useState({
        castingTime: 'All',
        class: 'All',
        levelMin: 0,
        levelMax: 9,
        name: '',
        status: 'All'
    });
    const [shownCard, setShownCard] = useState('');
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: spellsData, loading: spellsLoading } = useSpells();

    useEffect(() => {
        if (spellsData && spellsData.length > 0) {
            setSpells(spellsData);
            console.log(`${spellsData.length} spells`);

            // Check for index parameter in URL
            const index = searchParams.get('index');
            if (index) {
                const spell = spellsData.find(spell => spell.index === index);
                if (spell) {
                    setShownCard(index);
                    utils.scrollIntoView(index);
                }
            } else {
                // Set search filters from localStorage
                const savedFilter = localStorage.getItem('spellFilter');
                if (savedFilter) {
                    setFilter(JSON.parse(savedFilter));
                } else {
                    localStorage.setItem('spellFilter', JSON.stringify(filter));
                }
            }

            // Set known and prepared spells from localStorage
            let knownSpellsJson = localStorage.getItem('spellsKnown');
            let knownSpells = [];
            if (knownSpellsJson != null) {
                knownSpells = JSON.parse(knownSpellsJson);
            }

            let preparedSpellsJson = localStorage.getItem('spellsPrepared');
            let preparedSpells = [];
            if (preparedSpellsJson != null) {
                preparedSpells = JSON.parse(preparedSpellsJson);
            }

            // Update spells with known and prepared status
            const updatedSpells = spellsData.map(spell => ({
                ...spell,
                known: knownSpells.includes(spell.index),
                prepared: preparedSpells.includes(spell.index)
            }));
            setSpells(updatedSpells);
        }
    }, [spellsData]);

    const expandCard = (index, expanded) => {
        if (expanded) {
            setShownCard(index);
            utils.scrollIntoView(index);
        } else {
            setShownCard('');
        }

        // Update URL query params using setSearchParams
        if (expanded) {
            setSearchParams({ index });
        } else {
            setSearchParams({});
        }
    };

    const filterChanged = (newFilter) => {
        localStorage.setItem('spellFilter', JSON.stringify(newFilter));
    };

    const saveKnown = () => {
        let spellsKnown = [];
        spells.forEach(spell => {
            if (spell.known === true) {
                spellsKnown.push(spell.index);
            }
        });
        localStorage.setItem('spellsKnown', JSON.stringify(spellsKnown));
    };

    const savePrepared = () => {
        let spellsPrepared = [];
        spells.forEach(spell => {
            if (spell.prepared === true) {
                spellsPrepared.push(spell.index);
            }
        });
        localStorage.setItem('spellsPrepared', JSON.stringify(spellsPrepared));
    };

    const showSpell = (spell) => {
        // Casting Time filter
        if (filter.castingTime !== 'All' && (
            (filter.castingTime === 'Action' && !(spell.casting_time === '1 action')) ||
            (filter.castingTime === 'Bonus Action' && !(spell.casting_time === '1 bonus action')) ||
            (filter.castingTime === 'Non-Ritual, Long Cast Time' && 
                !(spell.ritual || spell.casting_time === '1 action' || spell.casting_time === '1 bonus action' || spell.casting_time === '1 reaction')) ||
            (filter.castingTime === 'Reaction' && !(spell.casting_time === '1 reaction')) ||
            (filter.castingTime === 'Ritual' && !spell.ritual)
        )) {
            return false;
        }

        // Class filter
        if (filter.class !== 'All' && !spell.classes.some(c => c === filter.class)) {
            return false;
        }

        // Level filter
        if (spell.level < filter.levelMin || spell.level > filter.levelMax) {
            return false;
        }

        // Name filter
        if (filter.name !== '' && !spell.name.toLowerCase().includes(filter.name.toLowerCase())) {
            return false;
        }

        // Status filter
        if (filter.status !== 'All' && (
            (filter.status === 'Known' && !spell.known) ||
            (filter.status === 'Prepared or Known Ritual' && (!spell.known || (!spell.prepared && !spell.ritual)))
        )) {
            return false;
        }

        return true;
    };

    const handleKnownChange = (index, isKnown) => {
        // Update local state immediately so UI reflects the change
        setSpells(prevSpells => 
            prevSpells.map(spell => 
                spell.index === index ? { ...spell, known: isKnown } : spell
            )
        );

        // Save to localStorage - get current known spells from state
        const spellsKnown = spells
            .filter(spell => spell.known)
            .map(spell => spell.index);

        if (isKnown) {
            // Add to known list
            spellsKnown.push(index);
        } else {
            // Remove from known list
            const filtered = spellsKnown.filter(i => i !== index);
            localStorage.setItem('spellsKnown', JSON.stringify(filtered));
        }

        if (isKnown) {
            localStorage.setItem('spellsKnown', JSON.stringify(spellsKnown));
        }

        // Also save prepared if needed
        const updatedSpell = spells.find(s => s.index === index);
        if (updatedSpell && !isKnown && updatedSpell.prepared) {
            updatedSpell.prepared = false;
            savePrepared();
        }
    };

    const handlePreparedChange = (index, isPrepared) => {
        // Update local state immediately so UI reflects the change
        setSpells(prevSpells => 
            prevSpells.map(spell => 
                spell.index === index ? { ...spell, prepared: isPrepared } : spell
            )
        );

        // Save to localStorage - get current prepared spells from state
        const spellsPrepared = spells
            .filter(spell => spell.prepared)
            .map(spell => spell.index);

        if (isPrepared) {
            // Add to prepared list
            spellsPrepared.push(index);
        } else {
            // Remove from prepared list
            const filtered = spellsPrepared.filter(i => i !== index);
            localStorage.setItem('spellsPrepared', JSON.stringify(filtered));
        }

        if (isPrepared) {
            localStorage.setItem('spellsPrepared', JSON.stringify(spellsPrepared));
        }

        // If not prepared, ensure it's known
        const updatedSpell = spells.find(s => s.index === index);
        if (updatedSpell && isPrepared && !updatedSpell.known) {
            updatedSpell.known = true;
            handleKnownChange(index, true);
        }
    };

    if (spellsLoading) {
        return <div className="list"><div>Loading spells...</div></div>;
    }

    const filteredSpells = spells.filter(showSpell);

    return (
        <>
            <SpellFilter filter={filter} onFilterChange={(newFilter) => { setFilter(newFilter); filterChanged(newFilter); }} />
            
            {/* Spells List */}
            <div className="list">
                {filteredSpells.map((spell) => (
                    <div key={spell.index} id={spell.index}>
                        {showSpell(spell) && (
                            <Spell 
                                spell={spell}
                                expand={shownCard === spell.index}
                                onExpand={(expanded) => expandCard(spell.index, expanded)}
                                onKnownChange={handleKnownChange}
                                onPreparedChange={handlePreparedChange}
                            />
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}

export default Spells;
