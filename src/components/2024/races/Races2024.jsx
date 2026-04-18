import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { use2024Races } from '../../../data/dataService';
import { scrollIntoView } from '../../../data/utils';
import RaceItem2024 from './RaceItem2024';

function Races2024() {
    const [races, setRaces] = useState([]);
    const [shownCard, setShownCard] = useState('');
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: racesData, loading: racesLoading } = use2024Races();

    useEffect(() => {
        if (racesData && racesData.length > 0) {
            setRaces(racesData);
            console.log(`${racesData.length} races`);

            // Check for index parameter in URL
            const index = searchParams.get('index');
            if (index) {
                const race = racesData.find(race => race.index === index);
                if (race) {
                    setShownCard(index);
                    scrollIntoView(index);
                }
            } else {
                // Set search filters from localStorage - default to "All" when no saved data
                const savedFilter = localStorage.getItem('races2024Filter');
                if (savedFilter) {
                    // Filter logic can be added here in the future
                } else {
                    localStorage.setItem('races2024Filter', JSON.stringify({ category: 'All' }));
                }
            }
        }
    }, [racesData]);

    const expandCard = (index, expanded) => {
        if (expanded) {
            setShownCard(index);
            scrollIntoView(index);
        } else {
            setShownCard('');
        }

        // Update URL query params using setSearchParams
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
        <>
            <div className="list">
                {races.map((race) => (
                    <div key={race.index} id={race.index}>
                        <RaceItem2024
                            race={race}
                            expand={shownCard === race.index}
                            onExpand={(expanded) => expandCard(race.index, expanded)}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}

export default Races2024;