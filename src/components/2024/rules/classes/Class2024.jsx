import { useState, useEffect } from 'react';
import { scrollIntoView } from '../../../../data/utils';
import Class2024Header from './Class2024Header';
import Class2024Majors from './Class2024Majors';
import Class2024CoreTraits from './Class2024CoreTraits';
import Class2024LevelProgression from './Class2024LevelProgression';
import Class2024Multiclassing from './Class2024Multiclassing';

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
                        <span dangerouslySetInnerHTML={{ __html: playerClass.class_description }} />
                    )}

                    {/* Core Traits */}
                    {playerClass.core_traits && (
                        <Class2024CoreTraits coreTraits={playerClass.core_traits} />
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

                    {/* Level Progression */}
                    {playerClass.class_levels && (
                        <Class2024LevelProgression 
                            playerClass={playerClass}
                            shownLevel={shownLevel}
                            onShowLevel={showLevel}
                        />
                    )}

                    {/* Multiclassing Info */}
                    <Class2024Multiclassing multiclassing={playerClass.multiclassing} />

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

