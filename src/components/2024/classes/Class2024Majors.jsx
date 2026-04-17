import { useState, useEffect } from 'react';
import { scrollIntoView } from '../../../data/utils';

function Class2024Majors({ playerClass, shownMajor, onShowMajor, majorFeatures }) {
    const [expandedMajor, setExpandedMajor] = useState(null);

    useEffect(() => {
        if (shownMajor) {
            scrollIntoView(`major-${shownMajor}`);
        }
    }, [shownMajor]);

    if (!playerClass || !playerClass.majors || playerClass.majors.length === 0) return null;

    const toggleMajor = (majorName) => {
        if (expandedMajor === majorName) {
            setExpandedMajor(null);
            onShowMajor('');
        } else {
            setExpandedMajor(majorName);
            onShowMajor(majorName);
        }
    };

    return (
        <div className="majors card w-100" style={{ marginBottom: '1rem' }}>
            <div className="card-header clickable">
                <div className="card-title">Major Options</div>
            </div>
            <div className="card-body">
                <p className="major-intro">
                    At 3rd level, you choose a major path that defines your specialization. 
                    Each major grants unique features at certain levels.
                </p>
                
                {playerClass.majors.map((major, index) => (
                    <div key={index} className="major-option" style={{ marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px', padding: '1rem' }}>
                        <div 
                            className="major-header clickable" 
                            onClick={() => toggleMajor(major.name)}
                            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <div>
                                <h5 style={{ margin: '0' }}>{major.name}</h5>
                                {major.subtitle && (
                                    <small className="major-subtitle">{major.subtitle}</small>
                                )}
                            </div>
                            <span className="toggle-icon">{expandedMajor === major.name ? '▼' : '▶'}</span>
                        </div>
                        
                        {expandedMajor === major.name && (
                            <div className="major-content" style={{ marginTop: '1rem' }}>
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
        </div>
    );
}

export default Class2024Majors;