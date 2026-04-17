import React from 'react';

/**
 * Component to display the level progression with a selector
 */
function Class2024LevelProgression({ playerClass, shownLevel, onShowLevel }) {
    if (!playerClass.class_levels) {
        return null;
    }

    return (
        <div className="level-progression-embedded" style={{ marginBottom: '1rem' }}>
            <h4>Level Progression</h4>
            {/* Level Selector */}
            <div className="level-selector" style={{ marginBottom: '1rem' }}>
                <b>Select Level:</b>&nbsp;
                {playerClass.class_levels.map((level) => (
                    <button
                        key={level.level}
                        className={`btn btn-sm ${shownLevel === level.level ? 'btn-primary' : 'btn-outline-secondary'}`}
                        style={{ margin: '0.125rem' }}
                        onClick={() => onShowLevel(level.level)}
                    >
                        {level.level}
                    </button>
                ))}
            </div>

            {/* Show features for selected level or all levels */}
            {shownLevel === 0 ? (
                <AllLevelsView playerClass={playerClass} />
            ) : (
                <SelectedLevelView playerClass={playerClass} shownLevel={shownLevel} />
            )}
        </div>
    );
}

/**
 * Component to display all levels and their features
 */
function AllLevelsView({ playerClass }) {
    return (
        <div>
            {playerClass.class_levels.map((level) => (
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
    );
}

/**
 * Component to display features for a selected level
 */
function SelectedLevelView({ playerClass, shownLevel }) {
    const selectedLevel = playerClass.class_levels.find(l => l.level === shownLevel);
    
    if (!selectedLevel) {
        return null;
    }

    // Collect all features up to this level
    const allFeatures = [];
    for (let i = 0; i < playerClass.class_levels.length; i++) {
        if (playerClass.class_levels[i].level <= shownLevel && playerClass.class_levels[i].features) {
            playerClass.class_levels[i].features.forEach((feature) => {
                // Only show if this is a new feature at this level
                if (feature.level === playerClass.class_levels[i].level) {
                    allFeatures.push({
                        ...feature,
                        sourceLevel: playerClass.class_levels[i].level
                    });
                }
            });
        }
    }

    return (
        <div className="selected-level-features">
            <h5 className="level-header" style={{ marginBottom: '1rem' }}>
                Level {selectedLevel.level} <span className="proficiency-badge">Proficiency: {selectedLevel.proficiency_bonus}</span>
            </h5>
            {allFeatures.map((feature, fIndex) => (
                <div key={fIndex} className="feature-item" style={{ marginBottom: '0.75rem' }}>
                    <b>Level {feature.sourceLevel}: {feature.name}:</b>&nbsp;
                    {feature.type === 'subclass_feature' && (
                        <span className="subclass-badge">(Subclass)</span>
                    )}
                    {feature.description && (
                        <span dangerouslySetInnerHTML={{ __html: feature.description }} />
                    )}
                </div>
            ))}
        </div>
    );
}

export default Class2024LevelProgression;