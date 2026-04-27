import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { use2024Races } from '../../../../data/dataService';
import { scrollIntoView } from '../../../../data/utils';
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
                const race = racesData.find(race => race.name === index);
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
        // expanded is the desired NEW state
        // If expanding, set shownCard to this index
        // If collapsing, clear shownCard
        setShownCard(expanded ? index : '');
        if (expanded) {
            scrollIntoView(index);
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
                 {races.map((race) => (
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