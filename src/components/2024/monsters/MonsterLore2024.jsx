import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { use2024Monsters, use2024MonsterTypes } from '../../../data/dataService';
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
    const [shownCard, setShownCard] = useState('');
    const [shownSubtype, setShownSubtype] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: monstersData, loading: monstersLoading } = use2024Monsters();
    const { data: monsterTypesData, loading: subtypeLoading } = use2024MonsterTypes();

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
    }, [monstersData, monsterTypesData]);

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

    // Group monsters by subtype for a given monster type
    const getMonstersBySubtype = (monstersList, typeMonsterIndices) => {
        const withSubtype = [];
        const withoutSubtype = [];

        typeMonsterIndices.forEach(monsterIndex => {
            const monster = monstersList.find(m => m.index === monsterIndex);
            if (monster) {
                if (monster.subtype && monster.subtype !== monster.type) {
                    withSubtype.push(monster);
                } else {
                    withoutSubtype.push(monster);
                }
            }
        });

        return { withSubtype, withoutSubtype };
    };

    if (monstersLoading || subtypeLoading) {
        return <div className="list"><div>Loading monster lore...</div></div>;
    }

    return (
        <>
            {monsterTypes.map((subtype) => {
                const typeMonsterIndices = subtype.monsters || [];
                const { withSubtype, withoutSubtype } = getMonstersBySubtype(monsters, typeMonsterIndices);

                return (
                    <div className="list" key={subtype.index}>
                        <div 
                            className={`card outer w-100 ${shownSubtype === subtype.index ? 'active' : ''}`} 
                            id={subtype.index}
                        >
                            <div 
                                className="card-header clickable"
                                onClick={() => showSubtype(subtype.index)}
                            >
                                <div className="card-title">{subtype.name}</div>
                            </div>
                            {shownSubtype === subtype.index && (
                                <div className="card-body">
                                    <div dangerouslySetInnerHTML={{ __html: subtype.desc }} />
                                    <br/>
                                    <h5>Monsters</h5>
                                    
                                    {/* Subtypes with their own monsters - grouped by unique subtype */}
                                    {(() => {
                                        const uniqueSubtypes = [...new Set(withSubtype.map(m => m.subtype))];
                                        return uniqueSubtypes.map(subtypeName => {
                                            const monstersInSubtype = withSubtype.filter(m => m.subtype === subtypeName);
                                            const firstMonster = monstersInSubtype[0];
                                            const isExpanded = shownCard === subtypeName;
                                            
                                            return (
                                                <div className="inner-list" key={subtypeName} id={subtypeName}>
                                            <div 
                                                className={`card inner w-100 ${shownCard === subtypeName ? 'active' : ''}`}
                                                onClick={() => expandCard(subtypeName, !shownCard.includes(subtypeName))}
                                            >
                                                <div className="card-header clickable">
                                                    <div className="card-title">{subtypeName}</div>
                                                    <i>
                                                        {firstMonster.size} {firstMonster.type.toLowerCase()}
                                                        {firstMonster.subtype && firstMonster.subtype !== firstMonster.type && (
                                                            <span> ({firstMonster.subtype})</span>
                                                        )}, {firstMonster.alignment}
                                                    </i>
                                                </div>
                                                {isExpanded && (
                                                    <div className="card-body">
                                                        <h6>Monsters in this subtype</h6>
                                                        {monstersInSubtype.map(innerMonster => (
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
                                        });
                                    })()}

                                    {/* Monsters without subtypes */}
                                    {withoutSubtype.map((monster) => (
                                        <div className="inner-list" key={monster.index} id={monster.index}>
                                            <Monster2024 
                                                monster={monster}
                                                expand={shownCard === monster.index}
                                                onExpand={(expanded) => expandCard(monster.index, expanded)}
                                                cardType="inner"
                                            />
                                        </div>
                                    ))}
                                    <div className="card-footer">
                                        {subtype.book} (page {subtype.page})
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

