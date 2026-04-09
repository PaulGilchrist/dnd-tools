import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { use2024Spells } from '../../../data/dataService';
import Spell from './Spell';
import SpellFilter from './SpellFilter';
import { useSpellFilter } from '../../../hooks/useSpellFilter';
import { useSpellPersistence } from '../../../hooks/useSpellPersistence';
import { scrollIntoView } from '../../../data/utils';
import './Spells.css';

function Spells2024() {
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
    const { data: spellsData, loading: spellsLoading } = use2024Spells();

    // Use extracted hooks
    const { knownSpells, preparedSpells } = useSpellPersistence();

    useEffect(() => {
        if (spellsData && spellsData.length > 0) {
            setSpells(spellsData);
            console.log(`${spellsData.length} 2024 spells`);

            // Check for index parameter in URL
            const index = searchParams.get('index');
            if (index) {
                const spell = spellsData.find(spell => spell.index === index);
                if (spell) {
                    setShownCard(index);
                    scrollIntoView(index);
                }
            } else {
                // Set search filters from localStorage
                const savedFilter = localStorage.getItem('spellFilter2024');
                if (savedFilter) {
                    setFilter(JSON.parse(savedFilter));
                } else {
                    localStorage.setItem('spellFilter2024', JSON.stringify(filter));
                }
            }

            // Update spells with known and prepared status
            const updatedSpells = spellsData.map(spell => ({
                ...spell,
                known: knownSpells.includes(spell.index),
                prepared: preparedSpells.includes(spell.index)
            }));
            setSpells(updatedSpells);
        }
    }, [spellsData, knownSpells, preparedSpells]);


    const expandCard = (index, expanded) => {
        if (expanded) {
            setShownCard(index);
            scrollIntoView(index);
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
        localStorage.setItem('spellFilter2024', JSON.stringify(newFilter));
    };

    const handleKnownChange = (index, isKnown) => {
        // Update local state immediately so UI reflects the change
        setSpells(prevSpells => 
            prevSpells.map(spell => 
                spell.index === index ? { ...spell, known: isKnown } : spell
            )
        );

        // Save to localStorage using the knownSpells from hook
        if (isKnown) {
            localStorage.setItem('spellsKnown2024', JSON.stringify([...knownSpells, index]));
        } else {
            localStorage.setItem('spellsKnown2024', JSON.stringify(knownSpells.filter(i => i !== index)));
        }

        // Also save prepared if needed
        const updatedSpell = spells.find(s => s.index === index);
        if (updatedSpell && !isKnown && updatedSpell.prepared) {
            updatedSpell.prepared = false;
        }
    };

    const handlePreparedChange = (index, isPrepared) => {
        // Update local state immediately so UI reflects the change
        setSpells(prevSpells => 
            prevSpells.map(spell => 
                spell.index === index ? { ...spell, prepared: isPrepared } : spell
            )
        );

        // Save to localStorage using the preparedSpells from hook
        if (isPrepared) {
            localStorage.setItem('spellsPrepared2024', JSON.stringify([...preparedSpells, index]));
        } else {
            localStorage.setItem('spellsPrepared2024', JSON.stringify(preparedSpells.filter(i => i !== index)));
        }

        // If not prepared, ensure it's known
        const updatedSpell = spells.find(s => s.index === index);
        if (updatedSpell && isPrepared && !updatedSpell.known) {
            updatedSpell.known = true;
            localStorage.setItem('spellsKnown2024', JSON.stringify([...knownSpells, index]));
        }
    };

    if (spellsLoading) {
        return <div className="list"><div>Loading 2024 spells...</div></div>;
    }

    const filteredSpells = spells.filter((spell) => useSpellFilter(filter, spell));

        return (
        <div className="spells-2024">
            <SpellFilter filter={filter} onFilterChange={(newFilter) => { setFilter(newFilter); filterChanged(newFilter); }} />
            
            {/* Spells List */}
            <div className="list">{filteredSpells.map((spell) => (
                    <div key={spell.index} id={spell.index}>
                        {useSpellFilter(filter, spell) && (
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
        </div>
    );
}

export default Spells2024;