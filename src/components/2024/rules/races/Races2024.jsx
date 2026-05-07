import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { use2024Races } from '../../../../data/dataService';
import { scrollIntoView } from '../../../../data/utils';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem } from '../../../../utils/localStorage';
import RaceItem2024 from './RaceItem2024';

function Races2024() {
    const [shownCard, setShownCard] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: racesData, loading: racesLoading } = use2024Races();

    // Handle URL index parameter and localStorage filter initialization
    const handleUrlIndex = (data, params) => {
        if (data && data.length > 0) {
            const index = params.get('index');
            if (index) {
                const race = data.find(race => race.name === index);
                if (race) {
                    setShownCard(index);
                    // Scroll after state update completes
                    requestAnimationFrame(() => scrollIntoView(index));
                }
            } else {
                const savedFilter = getLocalStorageItem(LOCAL_STORAGE_KEYS.RACES_FILTER_2024);
                if (!savedFilter) {
                    setLocalStorageItem(LOCAL_STORAGE_KEYS.RACES_FILTER_2024, { category: 'All' });
                }
            }
        }
    };

    const expandCard = (index, expanded) => {
                  // expanded is the desired NEW state
                  // If expanding, set shownCard to this index
                  // If collapsing, clear shownCard
        setShownCard(expanded ? index : '');
        if (expanded) {
            requestAnimationFrame(() => scrollIntoView(index));
            setSearchParams({ index });
        } else {
            setSearchParams({});
               }
            };

    // Process URL index when data is available
    useEffect(() => {
        handleUrlIndex(racesData, searchParams);
    }, [racesData, searchParams]);

    if (racesLoading) {
        return <div className="list"><div className="raceItem2024-loading">Loading 2024 races...</div></div>;
    }

    return (
                    <div className="list">
                        <div className="page-header">
                            <h1 className="card-title">Races</h1>
                            <div className="page-description">Choose a race for your character. Each race offers unique traits and abilities that reflect their culture, biology, and heritage.</div>
                        </div>
                        {racesData.map((race) => (
                            <div key={race.name} id={race.name}>
                                <RaceItem2024
                            race={race}
                            expand={shownCard === race.name}
                            onExpand={(expanded) => expandCard(race.name, expanded)}
                            />
                            </div>
                        ))}
                    </div>
                );
}

export default Races2024;
