import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useRaces } from '../../data/dataService';
import RaceItem from './RaceItem';

// Javascript utilities (matching Angular)
const utils = {
    scrollIntoView: function(index) {
        const element = document.getElementById(index);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
};

function Races() {
    const [races, setRaces] = useState([]);
    const [shownCard, setShownCard] = useState('');
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: racesData, loading: racesLoading } = useRaces();

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
                    utils.scrollIntoView(index);
                }
            } else {
                // Set search filters from localStorage - default to "All" when no saved data
                const savedFilter = localStorage.getItem('racesFilter');
                if (savedFilter) {
                    // Filter logic can be added here in the future
                } else {
                    localStorage.setItem('racesFilter', JSON.stringify({ category: 'All' }));
                }
            }
        }
    }, [racesData]);

    const expandCard = (index, expanded) => {
        if (expanded) {
            setShownCard(index);
            utils.scrollIntoView(index);
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
        return <div className="list"><div>Loading races...</div></div>;
    }

    return (
        <>
            <div className="list">
                {races.map((race) => (
                    <div key={race.index} id={race.index}>
                        <RaceItem
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

export default Races;
