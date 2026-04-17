import { useState, useEffect } from 'react';
import { scrollIntoView } from '../../../data/utils';
import Class2024Header from './Class2024Header';
import Class2024Features from './Class2024Features';
import Class2024Majors from './Class2024Majors';

function Class2024({ playerClass, expand, onExpand }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [shownLevel, setShownLevel] = useState(1);
    const [shownMajor, setShownMajor] = useState('');

    // Update local state when props change
    useEffect(() => {
        if (isExpanded !== (expand ? 1 : 0)) {
            setIsExpanded(!!expand);
        }
    }, [expand]);

    const getNameString = (names) => {
        if (!names || names.length === 0) return '';
        let nameString = '';
        names.forEach((name) => {
            nameString += `${name}, `;
        });
        return nameString.substring(0, nameString.length - 2);
    };

    const toggleDetails = () => {
        setIsExpanded(!isExpanded);
    };

    const showLevel = (level) => {
        if (level === shownLevel) {
            setShownLevel(0);
        } else {
            setShownLevel(level);
        }
    };

    const showMajor = (majorIndex) => {
        if (majorIndex === shownMajor) {
            setShownMajor('');
        } else {
            setShownMajor(majorIndex);
        }
    };

    const getClassFeatures = () => {
        if (!playerClass.class_levels) return [];
        
        const classLevels = playerClass.class_levels.filter((classLevel) => classLevel.level <= shownLevel);
        let classFeatures = [];
        for (let i = classLevels.length - 1; i >= 0; i--) {
            if (classLevels[i].features) {
                classLevels[i].features.forEach((feature) => {
                    if (feature.type === 'class_feature') {
                        const featureSummary = {
                            name: feature.name,
                            description: feature.description,
                            level: feature.level
                        };
                        if (!classFeatures.some((classFeature) => classFeature.name === feature.name)) {
                            classFeatures.push(featureSummary);
                        }
                    }
                });
            }
        }
        return classFeatures;
    };

    const getMajorFeatures = () => {
        if (!shownMajor || !playerClass.majors) return [];
        
        const major = playerClass.majors.find((m) => m.name === shownMajor);
        if (!major || !major.features) return [];

        const majorFeatures = [];
        const majorLevels = playerClass.class_levels.filter((classLevel) => classLevel.level <= shownLevel);
        
        majorFeatures.features = major.features.filter((feature) => {
            return majorLevels.some((level) => level.level >= feature.level);
        });
        
        return majorFeatures;
    };

    const handleToggle = () => {
        toggleDetails();
        onExpand(!isExpanded);
    };

    if (!playerClass) {
        return null;
    }

    const classFeatures = getClassFeatures();
    const majorFeatures = getMajorFeatures();

    return (
        <div className={`outer card w-100 ${isExpanded ? 'active' : ''}`} id={playerClass.index}>
            <Class2024Header 
                playerClass={playerClass}
                isExpanded={isExpanded}
                onToggle={handleToggle}
            />

            {isExpanded && (
                <div className="card-body">
                    {/* Class Description */}
                    {playerClass.class_description && (
                        <div className="class-description">
                            <b>About {playerClass.name}:</b>
                            <span dangerouslySetInnerHTML={{ __html: playerClass.class_description }} />
                        </div>
                    )}

                    {/* Core Traits - Embedded in card body */}
                    {playerClass.core_traits && (
                        <div className="core-traits-embedded" style={{ marginBottom: '1rem' }}>
                            <h4>Core Traits</h4>
                            {playerClass.core_traits.primary_ability && (
                                <div>
                                    <b>Primary Ability:</b>&nbsp;{playerClass.core_traits.primary_ability}
                                </div>
                            )}
                            {playerClass.core_traits.hit_point_die && (
                                <div>
                                    <b>Hit Die:</b>&nbsp;{playerClass.core_traits.hit_point_die}
                                </div>
                            )}
                            {playerClass.core_traits.saving_throw_proficiencies && (
                                <div>
                                    <b>Saving Throw Proficiencies:</b>&nbsp;{playerClass.core_traits.saving_throw_proficiencies}
                                </div>
                            )}
                            {playerClass.core_traits.skill_proficiencies && (
                                <div>
                                    <b>Skill Proficiencies:</b>&nbsp;{playerClass.core_traits.skill_proficiencies}
                                </div>
                            )}
                            {playerClass.core_traits.weapon_proficiencies && (
                                <div>
                                    <b>Weapon Proficiencies:</b>&nbsp;{playerClass.core_traits.weapon_proficiencies}
                                </div>
                            )}
                            {playerClass.core_traits.armor_training && (
                                <div>
                                    <b>Armor Training:</b>&nbsp;{playerClass.core_traits.armor_training}
                                </div>
                            )}
                            {playerClass.core_traits.tool_proficiencies && (
                                <div>
                                    <b>Tool Proficiencies:</b>&nbsp;{playerClass.core_traits.tool_proficiencies}
                                </div>
                            )}
                            {playerClass.core_traits.starting_equipment && (
                                <div>
                                    <b>Starting Equipment:</b>&nbsp;{playerClass.core_traits.starting_equipment}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Level-based Class Features */}
                    {classFeatures.length > 0 && (
                        <div>
                            <Class2024Features 
                                features={classFeatures}
                                shownLevel={shownLevel}
                            />
                        </div>
                    )}

                    {/* Level Progression - Embedded in card body */}
                    {playerClass.class_levels && (
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
                                        onClick={() => showLevel(level.level)}
                                    >
                                        {level.level}
                                    </button>
                                ))}
                            </div>

                            {/* Show features for selected level or all levels */}
                            {shownLevel === 0 ? (
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
                            ) : (
                                <div className="selected-level-features">
                                    {(() => {
                                        const selectedLevel = playerClass.class_levels.find(l => l.level === shownLevel);
                                        if (!selectedLevel) return null;
                                        
                                        // Display level header with proficiency bonus
                                        return (
                                            <>
                                                <h5 className="level-header" style={{ marginBottom: '1rem' }}>
                                                    Level {selectedLevel.level} <span className="proficiency-badge">Proficiency: {selectedLevel.proficiency_bonus}</span>
                                                </h5>
                                                {/* Collect all features up to this level */}
                                                {(() => {
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
                                            </>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Major Options (Subclasses) */}
                    {playerClass.majors && playerClass.majors.length > 0 && (
                        <div>
                            <Class2024Majors 
                                playerClass={playerClass}
                                shownMajor={shownMajor}
                                onShowMajor={showMajor}
                                majorFeatures={majorFeatures}
                            />
                        </div>
                    )}

                    {/* Multiclassing Info */}
                    {playerClass.multiclassing && (
                        <div className="multiclassing-info">
                            <h4>Multiclassing</h4>
                            <div dangerouslySetInnerHTML={{ __html: playerClass.multiclassing.requirements }} />
                            {playerClass.multiclassing.core_traits_gained && (
                                <div>
                                    <b>Core Traits Gained:</b>
                                    <span dangerouslySetInnerHTML={{ __html: playerClass.multiclassing.core_traits_gained }} />
                                </div>
                            )}
                            {playerClass.multiclassing.features_gained && (
                                <div>
                                    <b>Features Gained:</b>
                                    <span dangerouslySetInnerHTML={{ __html: playerClass.multiclassing.features_gained }} />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Source Reference */}
                    <div>
                        <br />
                        {playerClass.page && (
                            <div>{playerClass.book} (page {playerClass.page})</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Class2024;

