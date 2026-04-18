import { useState } from 'react';
import { use2024Backgrounds } from '../../data/dataService';
import './Backgrounds2024.css';

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
                            <div>
                                <div className="card-title">{background.name}</div>
                                <i>{background.description}</i>
                            </div>
                        </div>
                        
                        {shownCard === background.index && (
                            <div className="card-body" id={`${background.index}-body`}>
                                    <div>
                                        <h5>Skill Proficiencies</h5>
                                        {background.skill_proficiencies && background.skill_proficiencies.length > 0 ? (
                                            <ul>
                                                {background.skill_proficiencies.map((skill, idx) => (
                                                    <li key={idx}>{skill.charAt(0).toUpperCase() + skill.slice(1)}</li>
                                                ))}
                                            </ul>
                                        ) :  <>None</>}
                                    </div><br/>
                                    <div>
                                        <h5>Tool Proficiencies</h5>
                                        {background.tool_proficiencies && background.tool_proficiencies.length > 0 ? (
                                            <ul>
                                                {background.tool_proficiencies.map((tool, idx) => (
                                                    <li key={idx}>{tool.charAt(0).toUpperCase() + tool.slice(1)}</li>
                                                ))}
                                            </ul>
                                        ) : <>None</>}
                                    </div><br/>
                                    {/* <div>
                                        <h5>Languages</h5>
                                        {background.languages && background.languages.length > 0 ? (
                                            <ul>
                                                {background.languages.map((lang, idx) => (
                                                    <li key={idx}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</li>
                                                ))}
                                            </ul>
                                        ) : <>None</>}
                                    </div>
                                <br /> */}
                                <div className="feature-section">
                                    <h4>Feature: {background.feature}</h4>
                                    {background.feature_description}<br/>
                                </div>
                                <br />
                                <div className="equipment-section">
                                    <h4>Equipment</h4>
                                    <ul>
                                        {background.equipment && background.equipment.length > 0 ? (
                                            background.equipment.map((item, idx) => (
                                                <li key={idx}>{item.charAt(0).toUpperCase() + item.slice(1)}</li>
                                            ))
                                        ) :  <>None</>}
                                    </ul>
                                </div>
                                <br />
                                {background.book && background.page && (
                                    <p className="source-reference">
                                        ({background.book} page {background.page})
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Backgrounds2024;
