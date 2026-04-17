import { useState, useEffect } from 'react';
import { scrollIntoView } from '../../../data/utils';

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
        <div className="major-options-section" style={{ marginBottom: '1rem' }}>
            <h6>Major Options</h6>
            <p className="major-intro">
                At 3rd level, you choose a major path that defines your specialization. 
                Each major grants unique features at certain levels.
            </p>
            
            {playerClass.majors.map((major, index) => (
                <div key={index} className="major-option card w-100" style={{ marginBottom: '1rem' }}>
                    <div 
                        className="card-header clickable" 
                        onClick={() => toggleMajor(major.name)}
                        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}
                    >
                        <div className="card-title">
                            <h6 style={{ margin: '0' }}>{major.name}</h6>
                            {major.subtitle && (
                                <small className="major-subtitle">{major.subtitle}</small>
                            )}
                        </div>
                        <span className="toggle-icon" style={{ marginLeft: '0.5rem' }}>{expandedMajor === major.name ? '▼' : '▶'}</span>
                    </div>
                    
                    {expandedMajor === major.name && (
                        <div className="card-body">
                            {major.description && (
                                <div className="major-description" style={{ marginBottom: '1rem' }}>
                                    <span dangerouslySetInnerHTML={{ __html: major.description }} />
                                </div>
                            )}
                            
                            {/* Major Features */}
                            {major.features && major.features.length > 0 && (
                                <div className="major-features" style={{ marginBottom: '1rem' }}>
                                    <h6>Features:</h6>
                                    {major.features.map((feature, fIndex) => (
                                        <div key={fIndex} className="major-feature" style={{ marginBottom: '0.75rem', paddingLeft: '1rem', borderLeft: '3px solid #007bff' }}>
                                            <b>Level {feature.level}: {feature.name}:</b>
                                            {feature.description && (
                                                <div style={{ marginTop: '0.25rem' }}>
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
                                            <div key={sIndex} className="spell-item" style={{ marginBottom: '0.25rem' }}>
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

