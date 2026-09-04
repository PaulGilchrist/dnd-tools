import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { scrollIntoView } from '../../data/utils';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem } from '../../utils/localStorage';
import { renderHtmlContent } from '../../utils/htmlUtils';
import { useMonsters, useMonsterTypes, useMonsterSubtypes } from '../../data/dataService';
import { groupSubtypesByType } from '../../utils/monsterGrouping';
import Monster2024 from '../2024/monsters/Monster2024';
import SubtypeCard from '../2024/monsters/SubtypeCard';

// ─── Helper component (extracted to reduce MonsterLore function line count) ───

function TypeGroupCard2024({ typeGroup, shownSubtype, showSubtype, shownCard, shownMonster, expandCard, expandMonsterCard }) {
    return (
        <div className={`outer card w-100 ${shownSubtype === typeGroup.type ? 'active' : ''}`} id={typeGroup.type}>
            <div className="card-header clickable" onClick={() => showSubtype(typeGroup.type)}>
                <div className="card-title">{typeGroup.name}</div>
            </div>
            {shownSubtype === typeGroup.type && (
                <div className="card-body">
                    <div dangerouslySetInnerHTML={renderHtmlContent(typeGroup.description || '')} />
                    <br />
                    {typeGroup.trait_modifiers && typeGroup.trait_modifiers.length > 0 && (
                        <>
                            <h6>Trait Modifiers</h6>
                            <ul>
                                {typeGroup.trait_modifiers.map((modifier) => (
                                    <li key={modifier}>{modifier}</li>
                                ))}
                            </ul>
                        </>
                    )}
                    <br />
                    <h5>Subtypes</h5>
                    {typeGroup.subtypes
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(subtype => (
                            <SubtypeCard key={subtype.index} subtype={subtype}
                                shownCard={shownCard} shownMonster={shownMonster}
                                expandCard={expandCard} expandMonsterCard={expandMonsterCard} />
                        ))}
                    {typeGroup.monstersWithoutSubtype && typeGroup.monstersWithoutSubtype.length > 0 && (
                        <>
                            <br />
                            <h5>Monsters without Subtype</h5>
                            {typeGroup.monstersWithoutSubtype.map(monster => (
                                <div className="inner-list" key={monster.index}>
                                    <Monster2024 monster={monster} expand={shownMonster === monster.index}
                                        onExpand={(expanded) => expandMonsterCard(monster.index, expanded)} cardType="inner" />
                                </div>
                            ))}
                        </>
                    )}
                    {typeGroup.book && typeGroup.page && (
                        <div className="card-footer">{typeGroup.book} (page {typeGroup.page})</div>
                    )}
                </div>
            )}
        </div>
    );
}

function MonsterLore() {
    const [monsters, setMonsters] = useState([]);
    const [monsterSubtypes, setMonsterSubtypes] = useState([]);
    const [shownCard, setShownCard] = useState('');
    const [shownSubtype, setShownSubtype] = useState('');
    const [shownMonster, setShownMonster] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch consolidated data
    const { data: monstersData, loading: monstersLoading } = useMonsters();
    const { data: monsterTypesData, loading: subtypeLoading } = useMonsterTypes();
    const { data: subtypesData, loading: subtypesLoading } = useMonsterSubtypes();

    const expandCard = (index, expanded) => {
        if (expanded) { setShownCard(index); setShownMonster(''); scrollIntoView(index); }
        else { setShownCard(''); }
    };

    const expandMonsterCard = (index, expanded) => {
        if (expanded) { setShownMonster(index); scrollIntoView(index); }
        else { setShownMonster(''); }
    };

    const showSubtype = useCallback((index, updateUrl = true) => {
        if (shownSubtype === index) {
            setShownSubtype('');
            if (updateUrl) setSearchParams({});
        } else {
            setShownSubtype(index);
            scrollIntoView(index);
            if (updateUrl) setSearchParams({ index });
        }
    }, [shownSubtype, setSearchParams]);

    useEffect(() => {
        if (monstersData && monstersData.length > 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setMonsters(monstersData);

            // Check for index parameter in URL (normalize spaces to hyphens)
            const index = (searchParams.get('index') || '').replace(/[\s+]/g, '-');
            if (index) {
                const foundType = monsterTypesData?.find(subtype => subtype.index === index);
                const foundSubtype = subtypesData?.find(subtype => subtype.index === index);
                const found = foundType || foundSubtype;
                if (found) {
                    setShownSubtype(index);
                    scrollIntoView(index);
                }
            } else {
                // Set search filters from localStorage - default to "All" when no saved data
                const savedFilter = getLocalStorageItem(LOCAL_STORAGE_KEYS.MONSTER_LORE_FILTER);
                if (!savedFilter) {
                    const defaultFilter = { category: 'All' };
                    setLocalStorageItem(LOCAL_STORAGE_KEYS.MONSTER_LORE_FILTER, defaultFilter);
                }
            }
        }

        if (subtypesData) setMonsterSubtypes(subtypesData);
    }, [monstersData, monsterTypesData, subtypesData, searchParams.get('index')]);

    // Loading check: wait for monsters, types, and subtypes
    const isLoading = monstersLoading || subtypeLoading || subtypesLoading;
    if (isLoading) return <div className="list"><div className="hidden">Loading monster lore...</div></div>;

    // Grouped structure (Type -> Subtypes -> Monsters)
    const typeGroups = groupSubtypesByType(monsterSubtypes, monsters, monsterTypesData);
    return (
        <>
            {typeGroups.map((typeGroup) => (
                <div className="list" key={typeGroup.type}>
                    <TypeGroupCard2024 typeGroup={typeGroup} shownSubtype={shownSubtype}
                        showSubtype={showSubtype} shownCard={shownCard} shownMonster={shownMonster}
                        expandCard={expandCard} expandMonsterCard={expandMonsterCard} />
                </div>
            ))}
        </>
    );
}

export default MonsterLore;
