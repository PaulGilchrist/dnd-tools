import { useState, useEffect } from 'react';
import { scrollIntoView } from '../../../data/utils';
import './Class2024Majors.css'

function Class2024Majors({ playerClass, shownMajor, onShowMajor, majorFeatures }) {
    const [expandedMajor, setExpandedMajor] = useState('');

    useEffect(() => {
        if (shownMajor) {
            scrollIntoView(`major-${shownMajor}`);
        }
    }, [shownMajor]);

    if (!playerClass || !playerClass.majors || playerClass.majors.length === 0) return null;

    const toggleMajor = (majorName) => {
        if (expandedMajor === majorName) {
            setExpandedMajor('');
            onShowMajor('');
        } else {
            setExpandedMajor(majorName);
            onShowMajor(majorName);
        }
    };

    return (
        <div className="class2024-majors-container">
            <h5 className="class2024-majors-title">Major Options</h5>
            <p className="major-intro">
                At 3rd level, you choose a major path that defines your specialization. 
                Each major grants unique features at certain levels.
            </p>
            
            {playerClass.majors.map((major, index) => (
                <div key={index} className="card w-100 class2024-major-card">
                    <div 
                        className="card-header clickable class2024-major-header" 
                        onClick={() => toggleMajor(major.name)}
                    >
                        <div className="class2024-major-title-container">
                            <h5>{major.name}</h5>
                            {major.subtitle && (
                                <div>{major.subtitle}</div>
                            )}
                        </div>
                        <span className="toggle-icon class2024-toggle-icon">{expandedMajor === major.name ? '▼' : '▶'}</span>
                    </div>
                    
                    {expandedMajor === major.name && (
                        <div className="card-body">
                            {major.description && (
                                <div className="major-description class2024-major-description">
                                    <span dangerouslySetInnerHTML={{ __html: major.description }} />
                                </div>
                            )}
                            
                            {/* Major Features */}
                            {major.features && major.features.length > 0 && (
                                <div className="major-features class2024-major-features">
                                    <h6>Features:</h6>
                                    {major.features.map((feature, fIndex) => (
                                        <div key={fIndex} className="major-feature class2024-major-feature">
                                            <b>Level {feature.level}: {feature.name}:</b>
                                            {feature.description && (
                                                <div className="class2024-major-feature-description">
                                                    <span dangerouslySetInnerHTML={{ __html: feature.description }} />
                                                </div>
                                            )}
                                        </div>
                                                ))}
                                </div>
                            )}
                            
                            {/* Major Spells */}
                            {major.spells && major.spells.length > 0 && (
                                <div className="major-spells">
                                    <h6>Subclass Spells:</h6>
                                    <div className="spells-grid">
                                        {major.spells.map((spell, sIndex) => (
                                            <div key={sIndex} className="spell-item class2024-spell-item">
                                                <span className="spell-level">{spell.name}</span>
                                                <small> (Level {spell.level})</small>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
            </div>
            ))}
        </div>
    );
}

export default Class2024Majors;

