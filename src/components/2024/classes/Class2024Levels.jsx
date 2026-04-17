import { useEffect } from 'react';
import { scrollIntoView } from '../../../data/utils';

function Class2024Levels({ playerClass, shownLevel, onShowLevel }) {
    useEffect(() => {
        if (shownLevel > 0) {
            scrollIntoView(shownLevel);
        }
    }, [shownLevel]);

    if (!playerClass || !playerClass.class_levels) return null;

    const levels = playerClass.class_levels;

    return (
        <div className="playerClass-inner card w-100" style={{ marginBottom: '1rem' }}>
            <div className="card-header clickable">
                <h5>Level Progression</h5>
            </div>
            <div className="card-body">
                {/* Level Selector */}
                <div className="level-selector" style={{ marginBottom: '1rem' }}>
                    <b>Select Level:</b>&nbsp;
                    {levels.map((level) => (
                        <button
                            key={level.level}
                            className={`btn btn-sm ${shownLevel === level.level ? 'btn-primary' : 'btn-outline-secondary'}`}
                            style={{ margin: '0.125rem' }}
                            onClick={() => onShowLevel(level.level)}
                        >
                            {level.level}
                        </button>
                    ))}
                    {shownLevel !== 0 && (
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            style={{ margin: '0.125rem' }}
                            onClick={() => onShowLevel(0)}
                        >
                            All
                        </button>
                    )}
                </div>

                {/* Show features for selected level or all levels */}
                {shownLevel === 0 ? (
                    <div>
                        {levels.map((level) => (
                            <div key={level.level} id={level.level} style={{ marginBottom: '1.5rem' }}>
                                <h5 className="level-header">
                                    Level {level.level} <span className="proficiency-badge">Proficiency: {level.proficiency_bonus}</span>
                                </h5>
                                {level.features && level.features.length > 0 && (
                                    <div className="level-features">
                                        {level.features.map((feature, fIndex) => (
                                            <div key={fIndex} className="feature-item" style={{ marginBottom: '0.75rem' }}>
                                                <b>{feature.name}:</b>&nbsp;
                                                {feature.type === 'subclass_feature' && (
                                                    <span className="subclass-badge">(Subclass)</span>
                                                )}
                                                {feature.description && (
                                                    <span dangerouslySetInnerHTML={{ __html: feature.description }} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="selected-level-features">
                        {(() => {
                            const selectedLevel = levels.find(l => l.level === shownLevel);
                            if (!selectedLevel) return null;
                            
                            // Collect all features up to this level
                            const allFeatures = [];
                            for (let i = 0; i < levels.length; i++) {
                                if (levels[i].level <= shownLevel && levels[i].features) {
                                    levels[i].features.forEach((feature) => {
                                        // Only show if this is a new feature at this level
                                        if (feature.level === levels[i].level) {
                                            allFeatures.push({
                                                ...feature,
                                                sourceLevel: levels[i].level
                                            });
                                        }
                                    });
                                }
                            }
                            
                            return allFeatures.map((feature, fIndex) => (
                                <div key={fIndex} className="feature-item" style={{ marginBottom: '0.75rem' }}>
                                    <b>Level {feature.sourceLevel}: {feature.name}:</b>&nbsp;
                                    {feature.type === 'subclass_feature' && (
                                        <span className="subclass-badge">(Subclass)</span>
                                    )}
                                    {feature.description && (
                                        <span dangerouslySetInnerHTML={{ __html: feature.description }} />
                                    )}
                                </div>
                            ));
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Class2024Levels;