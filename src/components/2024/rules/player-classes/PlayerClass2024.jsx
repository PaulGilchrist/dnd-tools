import { useState, useEffect } from 'react';
import { scrollIntoView } from '../../../../data/utils';
import { renderHtmlContent } from '../../../../utils/htmlUtils';
import PlayerClass2024Header from './PlayerClass2024Header';
import PlayerClass2024Majors from './PlayerClass2024Majors';
import PlayerClass2024CoreTraits from './PlayerClass2024CoreTraits';
import PlayerClass2024LevelProgression from './PlayerClass2024LevelProgression';
import PlayerClass2024Multiclassing from './PlayerClass2024Multiclassing';

function PlayerClass2024({ playerClass, expand, onExpand }) {
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
            <PlayerClass2024Header 
                playerClass={playerClass}
                isExpanded={isExpanded}
                onToggle={handleToggle}
            />

            {isExpanded && (
                <div className="card-body">
                    {/* Class Description */}
                    {playerClass.class_description && (
                        <span dangerouslySetInnerHTML={renderHtmlContent(playerClass.class_description)} />
                    )}

                    {/* Core Traits */}
                                         {(playerClass.primary_ability || playerClass.hit_point_die || playerClass.saving_throw_proficiencies || playerClass.skill_proficiency_choices || playerClass.weapon_proficiencies || playerClass.armor_training || playerClass.tool_proficiencies || playerClass.starting_equipment) && (
                                             <PlayerClass2024CoreTraits playerClass={playerClass} />
                                         )}

                    {/* Major Options (Subclasses) */}
                    {playerClass.majors && playerClass.majors.length > 0 && (
                        <div>
                            <PlayerClass2024Majors 
                                playerClass={playerClass}
                                shownMajor={shownMajor}
                                onShowMajor={showMajor}
                                majorFeatures={majorFeatures}
                            />
                        </div>
                    )}

                    {/* Level Progression */}
                    {playerClass.class_levels && (
                        <PlayerClass2024LevelProgression 
                           playerClass={playerClass}
                           shownLevel={shownLevel}
                           shownMajor={shownMajor}
                           onShowLevel={showLevel}
                        />
                    )}

                    {/* Multiclassing Info */}
                    <PlayerClass2024Multiclassing multiclassing={playerClass.multiclassing} />

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

export default PlayerClass2024;

