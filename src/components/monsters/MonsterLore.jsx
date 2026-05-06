import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { scrollIntoView } from '../../data/utils';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem, getVersionedStorageKey } from '../../utils/localStorage';
import { renderHtmlContent } from '../../utils/htmlUtils';
import { useRuleVersion } from '../../context/RuleVersionContext';
import { useVersionedData } from '../../hooks/useVersionedData';
import Monster from './Monster';

function MonsterLore() {
    const [monsters, setMonsters] = useState([]);
    const [monsterTypes, setMonsterTypes] = useState([]);
    const [shownCard, setShownCard] = useState('');
    const [shownSubtype, setShownSubtype] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const { ruleVersion } = useRuleVersion();

    // Fetch data using version-aware hooks
    const { data: monstersData, loading: monstersLoading } = useVersionedData('monsters');
    const { data: monsterTypesData, loading: subtypeLoading } = useVersionedData('monsterTypes');

    useEffect(() => {
        if (monstersData && monstersData.length > 0) {
            setMonsters(monstersData);

            // Check for index parameter in URL
            const index = searchParams.get('index');
            if (index) {
                const monsterSubtype = monsterTypesData.find(subtype => subtype.index === index);
                if (monsterSubtype) {
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

        if (monsterTypesData) {
            setMonsterTypes(monsterTypesData);
        }
    }, [monstersData, monsterTypesData, ruleVersion]);

    const expandCard = (index, expanded) => {
        if (expanded) {
            setShownCard(index);
            scrollIntoView(index);
        } else {
            setShownCard('');
        }
    };

    const showSubtype = (index, updateUrl = true) => {
        console.log(index);
        if (shownSubtype === index) {
            setShownSubtype('');
            if (updateUrl) {
                setSearchParams({});
            }
        } else {
            setShownSubtype(index);
            scrollIntoView(index);
            if (updateUrl) {
                setSearchParams({ index });
            }
        }
    };

    if (monstersLoading || subtypeLoading) {
        return <div className="list"><div className="hidden">Loading monster lore...</div></div>;
    }

    return (
        <>
            {monsterTypes.map((subtype) => (
                <div className="list" key={subtype.index}>
                    <div 
                        className={`outer card w-100 ${shownSubtype === subtype.index ? 'active' : ''}`} 
                        id={subtype.index}
                    >
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
                                        {subtype.monsters.includes(monster.index) && (
                                            <Monster 
                                                monster={monster}
                                                expand={shownCard === monster.index}
                                                onExpand={(expanded) => expandCard(monster.index, expanded)}
                                                cardType="inner"
                                            />
                                        )}
                                    </div>
                                ))}
                                <div className="card-footer">
                                    {subtype.book} (page {subtype.page})
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
}

export default MonsterLore;

