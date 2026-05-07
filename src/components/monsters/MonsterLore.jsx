import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { scrollIntoView } from '../../data/utils';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem, getVersionedStorageKey } from '../../utils/localStorage';
import { renderHtmlContent } from '../../utils/htmlUtils';
import { useRuleVersion } from '../../context/RuleVersionContext';
import { useVersionedData } from '../../hooks/useVersionedData';
import { use2024MonsterSubtypes } from '../../data/dataService';
import { groupSubtypesByType } from '../../utils/monsterGrouping';
import Monster from './Monster';
import Monster2024 from '../2024/monsters/Monster2024';
import SubtypeCard from '../2024/monsters/SubtypeCard';

// ─── Helper components (extracted to reduce MonsterLore function line count) ───

function TypeGroupCard2024({ typeGroup, shownSubtype, showSubtype, shownCard, shownMonster, expandCard, expandMonsterCard }) {
    return (
        <div className={`outer card w-100 ${shownSubtype === typeGroup.type ? 'active' : ''}`} id={typeGroup.type}>
            <div className="card-header clickable" onClick={() => showSubtype(typeGroup.type)}>
                <div className="card-title">{typeGroup.name}</div>
            </div>
            {shownSubtype === typeGroup.type && (
                <div className="card-body">
                    <div dangerouslySetInnerHTML={renderHtmlContent(typeGroup.desc || '')} />
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

function TypeGroupCard5e({ subtype, shownSubtype, showSubtype, monsters, shownCard, expandCard }) {
    return (
        <div className={`outer card w-100 ${shownSubtype === subtype.index ? 'active' : ''}`} id={subtype.index}>
            <div className="card-header clickable" onClick={() => showSubtype(subtype.index)}>
                <div className="card-title">{subtype.name}</div>
            </div>
            {shownSubtype === subtype.index && (
                <div className="card-body">
                    <div dangerouslySetInnerHTML={renderHtmlContent(subtype.desc)} />
                    <br />
                    <h5>Monsters</h5>
                    {monsters.map((monster) => (
                        <div className="inner-list" key={monster.index} id={monster.index}>
                            {subtype.monsters && subtype.monsters.includes(monster.index) && (
                                <Monster monster={monster} expand={shownCard === monster.index}
                                    onExpand={(expanded) => expandCard(monster.index, expanded)} cardType="inner" />
                            )}
                        </div>
                    ))}
                    <div className="card-footer">{subtype.book} (page {subtype.page})</div>
                </div>
            )}
        </div>
    );
}

function MonsterLore() {
    const [monsters, setMonsters] = useState([]);
    const [monsterTypes, setMonsterTypes] = useState([]);
    const [monsterSubtypes, setMonsterSubtypes] = useState([]);
    const [shownCard, setShownCard] = useState('');
    const [shownSubtype, setShownSubtype] = useState('');
    const [shownMonster, setShownMonster] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const { ruleVersion } = useRuleVersion();

    // Fetch data using version-aware hooks
    const { data: monstersData, loading: monstersLoading } = useVersionedData('monsters');
    const { data: monsterTypesData, loading: subtypeLoading } = useVersionedData('monsterTypes');
    const { data: subtypesData, loading: subtypesLoading } = use2024MonsterSubtypes();

    const expandCard = (index, expanded) => {
        if (expanded) { setShownCard(index); setShownMonster(''); scrollIntoView(index); }
        else { setShownCard(''); }
    };

    const expandMonsterCard = (index, expanded) => {
        if (expanded) { setShownMonster(index); scrollIntoView(index); }
        else { setShownMonster(''); }
    };

    const showSubtype = (index, updateUrl = true) => {
        if (shownSubtype === index) {
            setShownSubtype('');
            if (updateUrl) setSearchParams({});
        } else {
            setShownSubtype(index);
            scrollIntoView(index);
            if (updateUrl) setSearchParams({ index });
        }
    };

    useEffect(() => {
        if (monstersData && monstersData.length > 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setMonsters(monstersData);

            // Check for index parameter in URL
            const index = searchParams.get('index');
            if (index) {
                const foundType = monsterTypesData?.find(subtype => subtype.index === index);
                const foundSubtype = subtypesData?.find(subtype => subtype.index === index);
                const found = foundType || foundSubtype;
                if (found) {
                    showSubtype(index, false);
                    scrollIntoView(index);
                }
            } else {
                // Set search filters from localStorage - default to "All" when no saved data
                const versionedFilterKey = getVersionedStorageKey(LOCAL_STORAGE_KEYS.MONSTER_LORE_FILTER, ruleVersion);
                const savedFilter = getLocalStorageItem(versionedFilterKey);
                if (!savedFilter) {
                    const defaultFilter = { category: 'All' };
                    setLocalStorageItem(versionedFilterKey, defaultFilter);
                }
            }
        }

        if (monsterTypesData) setMonsterTypes(monsterTypesData);
        if (subtypesData) setMonsterSubtypes(subtypesData);
    }, [monstersData, monsterTypesData, subtypesData, ruleVersion, searchParams, showSubtype, setSearchParams]);

    // Loading check: for 2024 also wait for subtypes
    const isLoading = monstersLoading || subtypeLoading || (ruleVersion === '2024' && subtypesLoading);
    if (isLoading) return <div className="list"><div className="hidden">Loading monster lore...</div></div>;

    // 2024: grouped structure (Type -> Subtypes -> Monsters)
    if (ruleVersion === '2024') {
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

    // 5e: flat structure (Type -> Monsters)
    return (
        <>
            {monsterTypes.map((subtype) => (
                <div className="list" key={subtype.index}>
                    <TypeGroupCard5e subtype={subtype} shownSubtype={shownSubtype}
                        showSubtype={showSubtype} monsters={monsters}
                        shownCard={shownCard} expandCard={expandCard} />
                </div>
            ))}
        </>
    );
}

export default MonsterLore;
