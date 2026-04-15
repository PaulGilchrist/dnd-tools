import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { use2024Monsters, use2024MonsterTypes, use2024MonsterSubtypes } from '../../../data/dataService';
import { scrollIntoView } from '../../../data/utils';
import Monster2024 from './Monster2024';
import './MonsterLore2024.css';

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
                const savedFilter = localStorage.getItem('monsterLore2024Filter');
                if (!savedFilter) {
                    const defaultFilter = { category: 'All' };
                    localStorage.setItem('monsterLore2024Filter', JSON.stringify(defaultFilter));
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
        
        monsterSubtypes.forEach(subtype => {
            // Find the first monster of this subtype to determine its type
            const subtypeMonsters = getMonstersForSubtype(subtype);
            if (subtypeMonsters.length === 0) {
                return;
            }
            
            const firstMonster = subtypeMonsters[0];
            const type = firstMonster.type;
            
            if (!grouped[type]) {
                grouped[type] = {
                    type,
                    name: type,
                    book: subtype.book,
                    page: subtype.page,
                    subtypes: []
                };
            }
            
            grouped[type].subtypes.push({
                ...subtype,
                monsters: subtypeMonsters,
                firstMonster: subtypeMonsters[0]
            });
        });
        
        return Object.values(grouped).sort((a, b) => a.name.localeCompare(b.name));
    };

    if (monstersLoading || typesLoading || subtypesLoading) {
        return <div className="list"><div>Loading monster lore...</div></div>;
    }

    const typeGroups = groupSubtypesByType();

    return (
        <>
            {typeGroups.map((typeGroup) => {
                return (
                    <div className="list" key={typeGroup.type}>
                        <div 
                            className={`card outer w-100 ${shownSubtype === typeGroup.type ? 'active' : ''}`} 
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
                                    <div dangerouslySetInnerHTML={{ __html: typeGroup.desc || '' }} />
                                    <br/>
                                    <h5>Subtypes</h5>
                                    
                                    {/* Sort subtypes alphabetically */}
                                    {typeGroup.subtypes
                                        .sort((a, b) => a.name.localeCompare(b.name))
                                        .map(subtype => {
                                            const isExpanded = shownCard === subtype.index;
                                            return (
                                                <div className="inner-list" key={subtype.index} id={subtype.index}>
                                                    <div 
                                                        className={`card inner w-100 ${isExpanded ? 'active' : ''}`}
                                                        onClick={() => expandCard(subtype.index, !isExpanded)}
                                                    >
                                                        <div className="card-header clickable">
                                                            <div className="card-title">{subtype.name}</div>
                                                            <i>
                                                                {subtype.firstMonster?.size} {subtype.firstMonster?.type?.toLowerCase()}
                                                                {subtype.firstMonster?.subtype && subtype.firstMonster.subtype !== subtype.firstMonster.type && (
                                                                    <span> ({subtype.firstMonster.subtype})</span>
                                                                )}, {subtype.firstMonster?.alignment}
                                                            </i>
                                                        </div>
                                                        {isExpanded && (
                                                            <div className="card-body">
                                                                {/* Display subtype info before monster list */}
                                                                {subtype['short-description'] && (
                                                                    <div className="subtype-info">
                                                                        <strong>Short Description:</strong> {subtype['short-description']}
                                                                    </div>
                                                                )}
                                                                {subtype.habitat && (
                                                                    <div className="subtype-info">
                                                                        <strong>Habitat:</strong> {subtype.habitat}
                                                                    </div>
                                                                )}
                                                                {subtype.desc && (
                                                                    <div className="subtype-info">
                                                                        <strong>Description:</strong>
                                                                        <div dangerouslySetInnerHTML={{ __html: subtype.desc }} />
                                                                    </div>
                                                                )}
                                                                <h6>Monsters in this subtype</h6>
                                                                {subtype.monsters.map(innerMonster => (
                                                                    <Monster2024 
                                                                        key={innerMonster.index}
                                                                        monster={innerMonster}
                                                                        expand={shownCard === innerMonster.index}
                                                                        onExpand={(expanded) => expandCard(innerMonster.index, expanded)}
                                                                        cardType="inner"
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    <div className="card-footer">
                                        {typeGroup.book} (page {typeGroup.page})
                                    </div>
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

