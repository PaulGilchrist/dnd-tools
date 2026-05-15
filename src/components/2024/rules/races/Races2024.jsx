import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { use2024Races } from '../../../../data/dataService';
import { scrollIntoView } from '../../../../data/utils';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem } from '../../../../utils/localStorage';
import RaceItem2024 from './RaceItem2024';

function Races2024() {
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
        const savedFilter = getLocalStorageItem(LOCAL_STORAGE_KEYS.RACES_FILTER_2024);
        if (!savedFilter) {
            setLocalStorageItem(LOCAL_STORAGE_KEYS.RACES_FILTER_2024, { category: 'All' });
        }
    }, []);

    // Fetch data
    const { data: racesData, loading: racesLoading } = use2024Races();

    const expandCard = (index, expanded) => {
        if (expanded) {
            setSearchParams({ index });
        } else {
            setSearchParams({});
        }
    };

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
