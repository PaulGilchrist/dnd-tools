import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { use2024Classes } from '../../../../data/dataService';
import { scrollIntoView } from '../../../../data/utils';
import PlayerClass2024 from './PlayerClass2024';

function PlayerClasses2024() {
    const [classes2024, setClasses2024] = useState([]);
    const [shownCard, setShownCard] = useState('');
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch 2024 class data
    const { data: classesData, loading: classesLoading } = use2024Classes();

    useEffect(() => {
        if (classesData && classesData.length > 0) {
            setClasses2024(classesData);

            // Check for index parameter in URL
            const index = searchParams.get('index');
            if (index) {
                const playerClass = classesData.find(item => item.index === index);
                if (playerClass) {
                    setShownCard(index);
                    scrollIntoView(index);
                }
            }
        }
    }, [classesData]);

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

    if (classesLoading) {
        return <div className="list"><div>Loading classes...</div></div>;
    }

    return (
        <div className="list">
            <div className="page-header">
                <h1 className="card-title">Player Classes</h1>
                <div className="page-description">Classes from the 2024 Dungeons & Dragons rules update. Each class includes core traits, level progression, and major options (replacing traditional subclasses).</div>
            </div>
            {classes2024.map((playerClass) => (
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