import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { usePlayerClasses } from '../../../data/dataService';
import PlayerClass from './PlayerClass';
import './PlayerClasses.css';

// Javascript utilities (matching Angular)
const utils = {
    scrollIntoView: function(index, offset = 0) {
        const element = document.getElementById(index);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
};

function PlayerClasses() {
    const [playerClasses, setPlayerClasses] = useState([]);
    const [shownCard, setShownCard] = useState('');
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: playerClassesData, loading: playerClassesLoading } = usePlayerClasses();

    useEffect(() => {
        if (playerClassesData && playerClassesData.length > 0) {
            setPlayerClasses(playerClassesData);

            // Check for index parameter in URL
            const index = searchParams.get('index');
            if (index) {
                const playerClass = playerClassesData.find(item => item.index === index);
                if (playerClass) {
                    setShownCard(index);
                    utils.scrollIntoView(index);
                }
            }
        }
    }, [playerClassesData]);

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

    if (playerClassesLoading) {
        return <div className="list"><div>Loading player classes...</div></div>;
    }

    return (
        <div className="list">
            {playerClasses.map((playerClass) => (
                <div key={playerClass.index} id={playerClass.index}>
                    <PlayerClass 
                        playerClass={playerClass}
                        expand={shownCard === playerClass.index}
                        onExpand={(expanded) => expandCard(playerClass.index, expanded)}
                    />
                </div>
            ))}
        </div>
    );
}

export default PlayerClasses;
