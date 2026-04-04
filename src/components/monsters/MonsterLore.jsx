import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMonsters, useMonsterSubtypes } from '../../data/dataService';
import { scrollIntoView } from '../../data/utils';
import Monster from './Monster';
import './MonsterLore.css';

function MonsterLore() {
    const [monsters, setMonsters] = useState([]);
    const [monsterSubtypes, setMonsterSubtypes] = useState([]);
    const [shownCard, setShownCard] = useState('');
    const [shownSubtype, setShownSubtype] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: monstersData, loading: monstersLoading } = useMonsters();
    const { data: monsterSubtypesData, loading: subtypeLoading } = useMonsterSubtypes();

    useEffect(() => {
        if (monstersData && monstersData.length > 0) {
            setMonsters(monstersData);

            // Check for index parameter in URL
            const index = searchParams.get('index');
            if (index) {
                const monsterSubtype = monsterSubtypesData.find(subtype => subtype.index === index);
                if (monsterSubtype) {
                    showSubtype(index, false);
                    scrollIntoView(index);
                }
            } else {
                // Set search filters from localStorage - default to "All" when no saved data
                const savedFilter = localStorage.getItem('monsterLoreFilter');
                if (!savedFilter) {
                    const defaultFilter = { category: 'All' };
                    localStorage.setItem('monsterLoreFilter', JSON.stringify(defaultFilter));
                }
            }
        }

        if (monsterSubtypesData) {
            setMonsterSubtypes(monsterSubtypesData);
        }
    }, [monstersData, monsterSubtypesData]);

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
        return <div className="list"><div>Loading monster lore...</div></div>;
    }

    return (
        <>
            {monsterSubtypes.map((subtype) => (
                <div className="list" key={subtype.index}>
                    <div 
                        className={`card outer w-100 ${shownSubtype === subtype.index ? 'active' : ''}`} 
                        id={subtype.index}
                    >
                        <div className="card-header clickable" onClick={() => showSubtype(subtype.index)}>
                            <div className="card-title">{subtype.name}</div>
                        </div>
                        {shownSubtype === subtype.index && (
                            <div className="card-body">
                                <div dangerouslySetInnerHTML={{ __html: subtype.desc }} />
                                <br/>
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
