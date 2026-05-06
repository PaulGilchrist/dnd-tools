import { useState, useEffect } from 'react';
import { renderHtmlContent } from '../../../utils/htmlUtils';
import '../../common/index.css';

function Feat2024({ feat, expand, onExpand }) {
    const [isExpanded, setIsExpanded] = useState(expand);

    useEffect(() => {
        if (expand !== isExpanded) {
            setIsExpanded(expand);
        }
    }, [expand, isExpanded]);

    const toggleDetails = () => {
        setIsExpanded(!isExpanded);
        onExpand(!isExpanded);
    };

    if (!feat) {
        return null;
    }

    const renderPrerequisites = (prereq) => {
        if (!prereq) return null;

        const parts = [];
        
        if (prereq.level) {
            parts.push(`Level ${prereq.level}+`);
        }
        
        if (prereq.ability_scores && prereq.ability_scores.length > 0) {
            prereq.ability_scores.forEach((abs, idx) => {
                parts.push(`${abs.name} ${abs.minimum}+`);
            });
        }
        
        if (prereq.feature) {
            parts.push(prereq.feature);
        }
        
        if (prereq.armor_training) {
            parts.push(prereq.armor_training);
        }
        
        if (prereq.weapon_training) {
            parts.push(prereq.weapon_training);
        }

        return parts.join(' & ');
    };

    return (
        <div className={`card ${isExpanded ? 'active' : ''}`} id={feat.name}>
            <div className="card-header clickable" onClick={toggleDetails}>
                <div className="card-title">
                    {feat.name.replace(/_/g, ' ')}
                    {feat.repeatable && <span className="repeatable-badge">Repeatable</span>}
                </div>
                <div className="card-subtitle">{feat.type}</div>
            </div>
            {isExpanded && (
                <div className="card-body">
                    <div className="card-text">
                        {feat.description && (
                            <div 
                                                            className="description"
                                                            dangerouslySetInnerHTML={renderHtmlContent(feat.description)}
                                                         />
                        )}
                        
                        {feat.prerequisites && (
                            <div>
                                <b>Prerequisites:</b> {renderPrerequisites(feat.prerequisites)}
                            </div>
                        )}
                        
                        {feat.benefits && feat.benefits.length > 0 && (
                              <div className="benefits-list">
                                <b>Benefits:</b>
                                <ul>
                                    {feat.benefits.map((benefit) => (
                                        <li key={benefit.name}>
                                            <b>{benefit.name}:</b> {benefit.description}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {feat.ability_score_increase && (
                            <div className="ability-score-increase">
                                <b>Ability Score Increase:</b>
                                {feat.ability_score_increase.scores?.map((score) => (
                                    <span key={score} className="ability-score-item">
                                        &nbsp;{score} +{feat.ability_score_increase.amount}
                                    </span>
                                ))}
                                (max {feat.ability_score_increase.max_value})
                            </div>
                        )}

                        {feat.tags && feat.tags.length > 0 && (
                              <div className="tags-container">
                                {feat.tags.map((tag) => (
                                      <span key={tag} className="tag-item">
                                        {tag.replace(/_/g, ' ')}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Feat2024;