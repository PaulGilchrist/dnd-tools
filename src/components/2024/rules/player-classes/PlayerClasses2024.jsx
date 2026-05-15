import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { use2024Classes } from '../../../../data/dataService';
import { scrollIntoView } from '../../../../data/utils';
import PlayerClass2024 from './PlayerClass2024';

function PlayerClasses2024() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Derive shownCard from URL params
    const shownCard = searchParams.get('index') || '';

    // Scroll to shown card when it changes
    useEffect(() => {
        if (shownCard) {
            requestAnimationFrame(() => scrollIntoView(shownCard));
        }
    }, [shownCard]);

    // Fetch 2024 class data
    const { data: classesData, loading: classesLoading } = use2024Classes();

    const expandCard = (index, expanded) => {
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
