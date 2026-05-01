import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { use2024Monsters, use2024MonsterTypes, use2024MonsterSubtypes } from '../../../data/dataService';
import { scrollIntoView } from '../../../data/utils';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem } from '../../../utils/localStorage';
import { renderHtmlContent } from '../../../utils/htmlUtils';
import Monster2024 from './Monster2024';

/**
 * MonsterLore2024 component - Displays monster subtypes with 2024 rules data
 * Each subtype card contains links to individual Monster2024 components
 */
function MonsterLore2024() {
    const [monsters, setMonsters] = useState([]);
    const [monsterTypes, setMonsterTypes] = useState([]);
    const [monsterSubtypes, setMonsterSubtypes] = useState([]);
    const [shownCard, setShownCard] = useState('');
    const [shownSubtype, setShownSubtype] = useState('');
    const [shownMonster, setShownMonster] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: monstersData, loading: monstersLoading } = use2024Monsters();
    const { data: monsterTypesData, loading: typesLoading } = use2024MonsterTypes();
    const { data: subtypesData, loading: subtypesLoading } = use2024MonsterSubtypes();

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
                const savedFilter = getLocalStorageItem(LOCAL_STORAGE_KEYS.MONSTER_LORE_FILTER_2024);
                if (!savedFilter) {
                    const defaultFilter = { category: 'All' };
                    setLocalStorageItem(LOCAL_STORAGE_KEYS.MONSTER_LORE_FILTER_2024, defaultFilter);
                }
            }
        }

        if (monsterTypesData) {
            setMonsterTypes(monsterTypesData);
        }

        if (subtypesData) {
            setMonsterSubtypes(subtypesData);
        }
    }, [monstersData, monsterTypesData, subtypesData]);

    const expandCard = (index, expanded) => {
        if (expanded) {
            setShownCard(index);
            setShownMonster('');
            scrollIntoView(index);
        } else {
            setShownCard('');
        }
    };

    const expandMonsterCard = (index, expanded) => {
        if (expanded) {
            setShownMonster(index);
            scrollIntoView(index);
        } else {
            setShownMonster('');
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

    // Get monsters that belong to a specific subtype by matching monster indices
    const getMonstersForSubtype = (subtype) => {
        if (!subtype.monsters || !subtype.monsters.length) {
            return [];
        }
        
        return subtype.monsters
            .map(monsterIndex => monsters.find(m => m.index === monsterIndex))
            .filter(monster => monster);
    };

    // Group subtypes by their parent type
    const groupSubtypesByType = () => {
        const grouped = {};
        const typeMonsterIndices = {};
        
        monsterSubtypes.forEach(subtype => {
            // Find the first monster of this subtype to determine its type
            const subtypeMonsters = getMonstersForSubtype(subtype);
            if (subtypeMonsters.length === 0) {
                return;
            }
            
            const firstMonster = subtypeMonsters[0];
            const type = firstMonster.type;
            
            if (!grouped[type]) {
                // Find the type-level data (description, book, page) from monsterTypesData
                // Normalize type names for matching (remove spaces, lowercase)
                const normalizedType = type.toLowerCase().replace(/\s+/g, '-');
                const typeData = monsterTypesData.find(t => 
                    t.index === type || 
                    t.index === normalizedType ||
                    (t.name && t.name.toLowerCase().replace(/\s+/g, '-') === normalizedType)
                );
                
                grouped[type] = {
                    type,
                    name: type,
                    desc: typeData?.desc || '',
                    trait_modifiers: typeData?.trait_modifiers || [],
                    book: typeData?.book || '',
                    page: typeData?.page || '',
                    subtypes: [],
                    monstersWithoutSubtype: []
                };
                typeMonsterIndices[type] = new Set();
            }
            
            grouped[type].subtypes.push({
                ...subtype,
                monsters: subtypeMonsters,
                firstMonster: subtypeMonsters[0]
            });
            
            // Track monsters that are in subtypes
            subtypeMonsters.forEach(m => typeMonsterIndices[type].add(m.index));
        });
        
        // Find monsters that belong to types but have no subtype
        monsterTypesData.forEach(typeData => {
            const type = typeData.index || typeData.name?.toLowerCase().replace(/\s+/g, '-');
            const normalizedType = type.toLowerCase().replace(/\s+/g, '-');
            
            // Find the actual type key in grouped (case-insensitive match)
            const groupedTypeKey = Object.keys(grouped).find(k => 
                k.toLowerCase().replace(/\s+/g, '-') === normalizedType
            );
            
            if (groupedTypeKey && typeMonsterIndices[groupedTypeKey]) {
                const monstersInType = typeData.monsters || [];
                const monstersWithoutSubtype = monstersInType
                    .filter(monsterIndex => !typeMonsterIndices[groupedTypeKey].has(monsterIndex))
                    .map(monsterIndex => monsters.find(m => m.index === monsterIndex))
                    .filter(m => m);
                
                console.log(`Type ${groupedTypeKey}: ${monstersInType.length} total, ${monstersWithoutSubtype.length} without subtype`);
                if (monstersWithoutSubtype.length > 0) {
                    grouped[groupedTypeKey].monstersWithoutSubtype = monstersWithoutSubtype;
                }
            }
        });
        
        return Object.values(grouped).sort((a, b) => a.name.localeCompare(b.name));
    };

    if (monstersLoading || typesLoading || subtypesLoading) {
        return <div className="list"><div className="hidden">Loading monster lore...</div></div>;
    }

    const typeGroups = groupSubtypesByType();

    return (
        <>
            {typeGroups.map((typeGroup) => {
                return (
                    <div className="list" key={typeGroup.type}>
                        <div 
                            className={`outer card w-100 ${shownSubtype === typeGroup.type ? 'active' : ''}`} 
                            id={typeGroup.type}
                        >
                            <div 
                                className="card-header clickable"
                                onClick={() => showSubtype(typeGroup.type)}
                            >
                                <div className="card-title">{typeGroup.name}</div>
                            </div>
                            {shownSubtype === typeGroup.type && (
                                <div className="card-body">
                                    {/* Show description and trait modifiers first */}
                                    <div dangerouslySetInnerHTML={renderHtmlContent(typeGroup.desc || '')} />
                                    <br />
                                    {typeGroup.trait_modifiers && typeGroup.trait_modifiers.length > 0 && (
                                        <>
                                            <h6>Trait Modifiers</h6>
                                            <ul>
                                                {typeGroup.trait_modifiers.map((modifier, idx) => (
                                                    <li key={idx}>{modifier}</li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                    <br />
                                    {console.log(`Rendering ${typeGroup.name}: ${typeGroup.monstersWithoutSubtype?.length || 0} monsters without subtype`)}
                                    <h5>Subtypes</h5>
                                    
                                    {/* Sort subtypes alphabetically */}
                                    {typeGroup.subtypes
                                        .sort((a, b) => a.name.localeCompare(b.name))
                                        .map(subtype => {
                                            const isExpanded = shownCard === subtype.index;
                                            return (
                                                <div className="inner-list" key={subtype.index} id={subtype.index}>
                                                    <div 
                                                        className={`card w-100 ${isExpanded ? 'active' : ''}`}
                                                        onClick={(e) => { e.stopPropagation(); expandCard(subtype.index, !isExpanded); }}
                                                    >
                                                        <div className="card-header clickable">
                                                            <div>
                                                                <div className="card-title">{subtype.name}</div>
                                                                <i>
                                                                    {subtype.firstMonster?.size} {subtype.firstMonster?.type?.toLowerCase()}
                                                                    {subtype.firstMonster?.subtype && subtype.firstMonster.subtype !== subtype.firstMonster.type && (
                                                                        <span> ({subtype.firstMonster.subtype})</span>
                                                                    )}
                                                                </i>
                                                            </div>
                                                        </div>
                                                        {isExpanded && (
                                                            <div className="card-body"
                                                                    onClick={(e) => e.stopPropagation()}>
                                                                {/* Display subtype info before monster list */}
                                                                {subtype['short-description'] && (
                                                                    <div>
                                                                        <strong>Short Description:</strong> {subtype['short-description']}
                                                                    </div>
                                                                )}
                                                                {subtype.habitat && (
                                                                    <div>
                                                                        <strong>Habitat:</strong> {subtype.habitat}
                                                                    </div>
                                                                )}
                                                                {subtype.desc && (
                                                                    <div>
                                                                        <strong>Description:</strong>
                                                                        <div dangerouslySetInnerHTML={renderHtmlContent(subtype.desc)} />
                                                                    </div>
                                                                )}
                                                                <h6>Monsters in this subtype</h6>
                                                                {subtype.monsters.map(innerMonster => (
                                                                    <Monster2024 
                                                                        key={innerMonster.index}
                                                                        monster={innerMonster}
                                                                        expand={shownMonster === innerMonster.index}
                                                                        onExpand={(expanded) => expandMonsterCard(innerMonster.index, expanded)}
                                                                        cardType="inner"
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    {/* Show monsters without subtypes */}
                                    {typeGroup.monstersWithoutSubtype && typeGroup.monstersWithoutSubtype.length > 0 && (
                                        <>
                                            <br />
                                            <h5>Monsters without Subtype</h5>
                                            {typeGroup.monstersWithoutSubtype.map(monster => (
                                                <div className="inner-list" key={monster.index}>
                                                    <Monster2024 
                                                        monster={monster}
                                                        expand={shownMonster === monster.index}
                                                        onExpand={(expanded) => expandMonsterCard(monster.index, expanded)}
                                                        cardType="inner"
                                                    />
                                                </div>
                                            ))}
                                        </>
                                    )}
                                    {/* Show book and page after subtypes and monsters */}
                                    {typeGroup.book && typeGroup.page && (
                                        <div className="card-footer">
                                            {typeGroup.book} (page {typeGroup.page})
                                        </div>
                                    )}
                                </div>
                        )}
                        </div>
                    </div>
                );
            })}
        </>
    );
}

export default MonsterLore2024;

