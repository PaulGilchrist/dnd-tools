import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRuleVersion } from '../../context/RuleVersionContext';
import { useVersionedData } from '../../hooks/useVersionedData';
import Spell from './Spell';
import SpellFilter from './SpellFilter';
import { filterSpells } from '../../hooks/useSpellFilter';
import { useSpellPersistence } from '../../hooks/useSpellPersistence';
import { LOCAL_STORAGE_KEYS, getVersionedStorageKey, getLocalStorageItem, setLocalStorageItem, sanitizeFilter } from '../../utils/localStorage';
import { scrollIntoView } from '../../data/utils';

function Spells() {
    const { ruleVersion } = useRuleVersion();
    const [searchParams, setSearchParams] = useSearchParams();

    // Version-aware storage key for filter
    const filterKey = getVersionedStorageKey(LOCAL_STORAGE_KEYS.SPELL_FILTER, ruleVersion);

    // Version-aware data fetching
    const { data: spellsData, loading: spellsLoading } = useVersionedData('spells');

    // Filter state with default value and localStorage initialization
    const [filter, setFilter] = useState(() => {
        const savedFilter = getLocalStorageItem(filterKey);
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

    // Save filter to versioned localStorage whenever it changes
    useEffect(() => {
        setLocalStorageItem(filterKey, filter);
    }, [filter]);

    // Derive shownCard from URL params
    const shownCard = searchParams.get('index') || '';

    // Scroll to shown card when it changes
    useEffect(() => {
        if (shownCard) {
            requestAnimationFrame(() => scrollIntoView(shownCard));
        }
    }, [shownCard]);

    // Use extracted hooks with versioning
    const { knownSpells, preparedSpells, addKnown, removeKnown, addPrepared, removePrepared } = useSpellPersistence({ ruleVersion });

    // Derive enhanced spells from data + persistence state
    const spells = spellsData && spellsData.length > 0 ? spellsData.map(spell => ({
        ...spell,
        known: knownSpells.includes(spell.index),
        prepared: preparedSpells.includes(spell.index)
    })) : [];

    const expandCard = (index, expanded) => {
        if (expanded) {
            setSearchParams({ index });
        } else {
            setSearchParams({});
        }
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
            <SpellFilter filter={filter} onFilterChange={setFilter} />

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
