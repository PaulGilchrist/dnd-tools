import { useState, useEffect } from 'react';
import { useAbilityScores } from '../../data/dataService';
import { scrollIntoView } from '../../data/utils';
import AbilityScore from './AbilityScore';


function AbilityScores() {
    const [abilityScores, setAbilityScores] = useState([]);
    const [shownCard, setShownCard] = useState('');

    // Fetch data
    const { data: abilityScoresData, loading } = useAbilityScores();

    useEffect(() => {
        if (abilityScoresData && abilityScoresData.length > 0) {
            setAbilityScores(abilityScoresData);
        }
    }, [abilityScoresData]);

    const expandCard = (index, expanded) => {
        if (expanded) {
            setShownCard(index);
            scrollIntoView(index);
        } else {
            setShownCard('');
        }
    };

    if (loading) {
        return <div className="list"><div>Loading ability scores...</div></div>;
    }

    return (
        <div className="list">
            {abilityScores.map((abilityScore) => (
                <div key={abilityScore.index} id={abilityScore.index}>
                    <AbilityScore 
                        abilityScore={abilityScore}
                        expand={shownCard === abilityScore.index}
                        onExpand={(expanded) => expandCard(abilityScore.index, expanded)}
                    />
                </div>
            ))}
        </div>
    );
}

export default AbilityScores;
