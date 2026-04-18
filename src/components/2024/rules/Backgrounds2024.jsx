import { useState } from 'react';
import { use2024Backgrounds } from '../../../data/dataService';

function Backgrounds2024() {
    const [backgrounds, setBackgrounds] = useState([]);
    const [shownCard, setShownCard] = useState('');

    const { data: backgroundsData, loading } = use2024Backgrounds();

    if (loading) {
        return <div className="list"><div>Loading backgrounds...</div></div>;
    }

    const expandCard = (index) => {
        setShownCard(shownCard === index ? '' : index);
    };

    return (
        <div className="list">
            {backgroundsData && backgroundsData.map((background) => (
                <div key={background.index} id={background.index}>
                    <div 
                        className={`card w-100 ${shownCard === background.index ? 'active' : ''}`} 
                        id={background.index}
                    >
                        <div 
                            className="card-header clickable" 
                            id={`${background.index}-header`}
                            onClick={() => expandCard(background.index)}
                        >
                            <div className="card-title">{background.name}</div>
                        </div>
                        
                        {shownCard === background.index && (
                            <div className="card-body" id={`${background.index}-body`}>
                                {background.description}<br/><br/>
                                <b>Ability Scores</b>: {background.ability_scores}<br/>
                                <b>Feat</b>: {background.feat}<br/>
                                <b>Skill Proficiencies</b>: {background.skill_proficiencies}<br/>
                                <b>Tool Proficiency</b>: {background.tool_proficiency}<br/>
                                <b>Equipment</b>: {background.equipment}<br/>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Backgrounds2024;
