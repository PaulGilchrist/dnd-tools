import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { use2024Spells } from '../../../data/dataService';
import Spell from './Spell';
import SpellFilter from './SpellFilter';
import { filterSpells } from '../../../hooks/useSpellFilter';
import { useSpellPersistence } from '../../../hooks/useSpellPersistence';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem, sanitizeFilter } from '../../../utils/localStorage';
import { scrollIntoView } from '../../../data/utils';

function Spells2024() {
    const [filter, setFilter] = useState(() => {
        const savedFilter = getLocalStorageItem(LOCAL_STORAGE_KEYS.SPELL_FILTER_2024);
        if (savedFilter) {
            const spellsDefaultFilter = { castingTime: 'All', class: 'All', levelMin: 0, levelMax: 9, name: '', status: 'All' };
            return sanitizeFilter(spellsDefaultFilter, savedFilter);
        }
        return {
            castingTime: 'All',
            class: 'All',
            levelMin: 0,
            levelMax: 9,
            name: '',
            status: 'All'
        };
    });
    const [searchParams, setSearchParams] = useSearchParams();

    // Derive shownCard from URL params
    const shownCard = searchParams.get('index') || '';

    // Scroll to shown card when it changes
    useEffect(() => {
        if (shownCard) {
            requestAnimationFrame(() => scrollIntoView(shownCard));
        }
    }, [shownCard]);

    // Initialize localStorage filter on mount
    useEffect(() => {
        const savedFilter = getLocalStorageItem(LOCAL_STORAGE_KEYS.SPELL_FILTER_2024);
        if (!savedFilter) {
            setLocalStorageItem(LOCAL_STORAGE_KEYS.SPELL_FILTER_2024, filter);
        }
    }, []);

    // Fetch data
    const { data: spellsData, loading: spellsLoading } = use2024Spells();

    // Use extracted hooks
    const { knownSpells, preparedSpells, addKnown, removeKnown, addPrepared, removePrepared } = useSpellPersistence();

    const expandCard = (index, expanded) => {
        if (expanded) {
            setSearchParams({ index });
        } else {
            setSearchParams({});
        }
    };

    const filterChanged = (newFilter) => {
        setLocalStorageItem(LOCAL_STORAGE_KEYS.SPELL_FILTER_2024, newFilter);
    };

    const handleKnownChange = (index, isKnown) => {
        if (isKnown) {
            addKnown(index);
        } else {
            removeKnown(index);
            // If unmarking known and spell is prepared, also unprepare
            const spell = spellsData?.find(s => s.index === index);
            if (spell && preparedSpells.includes(index)) {
                removePrepared(index);
            }
        }
    };

    const handlePreparedChange = (index, isPrepared) => {
        if (isPrepared) {
            addPrepared(index);
            // If preparing and not known, also mark as known
            if (!knownSpells.includes(index)) {
                addKnown(index);
            }
        } else {
            removePrepared(index);
        }
    };

    if (spellsLoading) {
        return <div className="list"><div>Loading 2024 spells...</div></div>;
    }

    const spells = spellsData ? spellsData.map(spell => ({
        ...spell,
        known: knownSpells.includes(spell.index),
        prepared: preparedSpells.includes(spell.index)
    })) : [];

    const filteredSpells = spells.filter((spell) => filterSpells(filter, spell));

    return (
        <div className="spells-2024">
            <SpellFilter filter={filter} onFilterChange={(newFilter) => { setFilter(newFilter); filterChanged(newFilter); }} />
            
            {/* Spells List */}
            <div className="list">{filteredSpells.map((spell) => (
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
        </div>
    );
}

export default Spells2024;
