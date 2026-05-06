import { useState } from 'react';
import { useAbilityScores } from '../../data/dataService';
import { scrollIntoView } from '../../data/utils';
import AbilityScore from './AbilityScore';


function AbilityScores() {
    const [shownCard, setShownCard] = useState('');

    // Fetch data
    const { data: abilityScoresData, loading } = useAbilityScores();

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
                 <div className="page-header">
                     <h1 className="card-title">Ability Scores</h1>
                     <div className="page-description">All creatures-characters and monsters-have six abilities that measure physical and mental characteristics, as detailed below</div>
                 </div>
                 {abilityScoresData?.map((abilityScore) => (
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
