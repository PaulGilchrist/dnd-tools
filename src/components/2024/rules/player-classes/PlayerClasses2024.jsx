import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { use2024Classes } from '../../../../data/dataService';
import { scrollIntoView } from '../../../../data/utils';
import PlayerClass2024 from './PlayerClass2024';

function PlayerClasses2024() {
    const [shownCard, setShownCard] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch 2024 class data
    const { data: classesData, loading: classesLoading } = use2024Classes();

    // Handle URL index parameter
    const handleUrlIndex = (data, params) => {
        if (data && data.length > 0) {
            const index = params.get('index');
            if (index) {
                const playerClass = data.find(item => item.index === index);
                if (playerClass) {
                    setShownCard(index);
                    // Scroll after state update completes
                    requestAnimationFrame(() => scrollIntoView(index));
                }
            }
        }
    };

    const expandCard = (index, expanded) => {
        if (expanded) {
            setShownCard(index);
            requestAnimationFrame(() => scrollIntoView(index));
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

    // Process URL index when data is available
    useEffect(() => {
        handleUrlIndex(classesData, searchParams);
    }, [classesData, searchParams]);

    if (classesLoading) {
        return <div className="list"><div>Loading classes...</div></div>;
    }

    return (
        <div className="list">
            <div className="page-header">
                <h1 className="card-title">Player Classes</h1>
                <div className="page-description">Classes from the 2024 Dungeons & Dragons rules update. Each class includes core traits, level progression, and major options (replacing traditional subclasses).</div>
            </div>
            {classesData.map((playerClass) => (
                <div key={playerClass.index} id={playerClass.index}>
                    <PlayerClass2024
                        playerClass={playerClass}
                        expand={shownCard === playerClass.index}
                        onExpand={(expanded) => expandCard(playerClass.index, expanded)}
                    />
                </div>
            ))}
        </div>
    );
}

export default PlayerClasses2024;
