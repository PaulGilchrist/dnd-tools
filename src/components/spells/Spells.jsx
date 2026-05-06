import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSpells } from '../../data/dataService';
import Spell from './Spell';
import SpellFilter from './SpellFilter';
import { filterSpells } from '../../hooks/useSpellFilter';
import { useSpellPersistence } from '../../hooks/useSpellPersistence';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem } from '../../utils/localStorage';

import { scrollIntoView } from '../../data/utils';

function Spells() {
    const [filter, setFilter] = useState({
        castingTime: 'All',
        class: 'All',
        levelMin: 0,
        levelMax: 9,
        name: '',
        status: 'All'
    });
    const [shownCard, setShownCard] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: spellsData, loading: spellsLoading } = useSpells();

    // Use extracted hooks
    const { knownSpells, preparedSpells, addKnown, removeKnown, addPrepared, removePrepared } = useSpellPersistence();

    // Derive enhanced spells from data + persistence state
    const spells = useMemo(() => {
        if (!spellsData || spellsData.length === 0) return [];
        return spellsData.map(spell => ({
            ...spell,
            known: knownSpells.includes(spell.index),
            prepared: preparedSpells.includes(spell.index)
        }));
    }, [spellsData, knownSpells, preparedSpells]);

    // Side effects: URL param checking and localStorage filter loading
    useEffect(() => {
        if (!spellsData || spellsData.length === 0) return;

        console.log(`${spellsData.length} spells`);

        const index = searchParams.get('index');
        if (index) {
            const spell = spellsData.find(spell => spell.index === index);
            if (spell) {
                setShownCard(index);
                scrollIntoView(index);
            }
        } else {
            const savedFilter = getLocalStorageItem(LOCAL_STORAGE_KEYS.SPELL_FILTER);
            if (savedFilter) {
                setFilter(savedFilter);
            } else {
                setLocalStorageItem(LOCAL_STORAGE_KEYS.SPELL_FILTER, filter);
            }
        }
    }, [spellsData]);

    const expandCard = (index, expanded) => {
        if (expanded) {
            setShownCard(index);
            scrollIntoView(index);
        } else {
            setShownCard('');
        }

        if (expanded) {
            setSearchParams({ index });
        } else {
            setSearchParams({});
        }
    };

    const filterChanged = (newFilter) => {
        setLocalStorageItem(LOCAL_STORAGE_KEYS.SPELL_FILTER, newFilter);
    };

    const handleKnownChange = (index, isKnown) => {
        if (isKnown) {
            addKnown(index);
        } else {
            removeKnown(index);
            // If unmarking known and spell is prepared, also unprepare
            if (spells.find(s => s.index === index)?.prepared) {
                removePrepared(index);
            }
        }
    };

    const handlePreparedChange = (index, isPrepared) => {
        if (isPrepared) {
            addPrepared(index);
            // If preparing and not known, also mark as known
            if (!spells.find(s => s.index === index)?.known) {
                addKnown(index);
            }
        } else {
            removePrepared(index);
        }
    };

    if (spellsLoading) {
        return <div className="list"><div>Loading spells...</div></div>;
    }

    const filteredSpells = spells.filter((spell) => filterSpells(filter, spell));

    return (
                <>
                    <SpellFilter filter={filter} onFilterChange={(newFilter) => { setFilter(newFilter); filterChanged(newFilter); }} />

                    {/* Spells List */}
                    <div className="list">
                        {filteredSpells.map((spell) => (
                            <div key={spell.index} id={spell.index}>
                                <Spell
                                  spell={spell}
                                  expand={shownCard === spell.index}
                                  onExpand={(expanded) => expandCard(spell.index, expanded)}
                                  onKnownChange={handleKnownChange}
                                  onPreparedChange={handlePreparedChange}
                                  />
                            </div>
                        ))}
                    </div>
                </>
            );
}

export default Spells;
