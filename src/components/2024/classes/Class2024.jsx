import { useState, useEffect } from 'react';
import { scrollIntoView } from '../../../data/utils';
import Class2024Header from './Class2024Header';
import Class2024BasicInfo from './Class2024BasicInfo';
import Class2024Features from './Class2024Features';
import Class2024Levels from './Class2024Levels';
import Class2024Majors from './Class2024Majors';

function Class2024({ playerClass, expand, onExpand }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [shownLevel, setShownLevel] = useState(0);
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

                    {/* Core Traits */}
                    {playerClass.core_traits && (
                        <Class2024BasicInfo 
                            playerClass={playerClass} 
                            getNameString={getNameString}
                        />
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

                    {/* Level Progression */}
                    <div>
                        <Class2024Levels 
                            playerClass={playerClass}
                            shownLevel={shownLevel}
                            onShowLevel={showLevel}
                        />
                    </div>

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