import React from 'react';
import { renderHtmlContent } from '../../../../utils/htmlUtils';
import {
    Feats2024,
    ExtraAttacks,
    EnergyInfo,
    SpellcastingInfo,
    BarbarianInfo,
    BardicInfo,
    ChannelDivinity,
    DruidInfo,
    FighterInfo,
    MonkInfo,
    RangerInfo,
    RogueInfo,
    SorcererInfo,
    WarlockInfo
} from './ClassLevelRenderers';
import './PlayerClass2024LevelProgression.css';

/**
 * Component to display the level progression with a selector
 */
function PlayerClass2024LevelProgression({ playerClass, shownLevel, shownMajor, onShowLevel }) {
    if (!playerClass.class_levels) {
        return null;
    }

    return (
        <div className="level-progression-embedded class2024-level-progression-embedded">
            <h4>Level Progression</h4>
            {/* Level Selector */}
            <div className="level-selector class2024-level-selector">
                <b>Select Level:</b>&nbsp;
                {playerClass.class_levels.map((level) => (
                    <button
                        key={level.level}
                        className={`btn btn-sm ${shownLevel === level.level ? 'btn-primary' : 'btn-outline-secondary'} class2024-level-selector-btn`}
                        onClick={() => onShowLevel(level.level)}
                    >
                        {level.level}
                    </button>
                ))}
            </div>

            {/* Show features for selected level */}
            <SelectedLevelView playerClass={playerClass} shownLevel={shownLevel} shownMajor={shownMajor} />
        </div>
    );
}

/**
 * Component to display features for a selected level
 */
function SelectedLevelView({ playerClass, shownLevel, shownMajor }) {
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

    // Check if energy should be shown (only if required_major matches shownMajor or has no required_major)
    const shouldShowEnergy = selectedLevel.energy && (
        !selectedLevel.energy.required_major ||
        selectedLevel.energy.required_major === shownMajor
    );

    // Check if spellcasting should be shown (only if required_major matches shownMajor or has no required_major)
    const shouldShowSpellcasting = selectedLevel.spellcasting && (
        !selectedLevel.spellcasting.required_major ||
        selectedLevel.spellcasting.required_major === shownMajor
    );

    return (
        <div className="selected-level-features">
            <b>Proficiency:</b> +{selectedLevel.proficiency_bonus}<br />
            {/* Feats */}
             <Feats2024 level={selectedLevel.level} />
            {/* Extra Attacks */}
             <ExtraAttacks level={selectedLevel} />
            {/* Barbarian Info - Rages, Rage Damage, Weapon Mastery */}
             <BarbarianInfo level={selectedLevel} className={playerClass.name} />
            {/* Bard Info - Bardic Die */}
             <BardicInfo level={selectedLevel} />
            {/* Cleric Info - Channel Divinity */}
             <ChannelDivinity level={selectedLevel} />
            {/* Druid Info - Wild Shape, Beast Forms, Max CR, Fly Speed */}
             <DruidInfo level={selectedLevel} />
            {/* Fighter Info - Second Wind, Weapon Mastery */}
             <FighterInfo level={selectedLevel} className={playerClass.name} />
            {/* Monk Info - Martial Arts Die, Focus Points, Unarmored Movement Increase */}
             <MonkInfo level={selectedLevel} />
            {/* Ranger Info - Favored Enemy */}
             <RangerInfo level={selectedLevel} />
            {/* Rogue Info - Sneak Attack */}
             <RogueInfo level={selectedLevel} />
            {/* Sorcerer Info - Sorcery Points */}
             <SorcererInfo level={selectedLevel} />
            {/* Warlock Info - Eldritch Invocations */}
             <WarlockInfo level={selectedLevel} />
            {/* Energy Info - only show if required_major matches shownMajor or has no required_major */}
             {shouldShowEnergy && <EnergyInfo energy={selectedLevel.energy} />}
            {/* Spellcasting Info - only show if required_major matches shownMajor or has no required_major */}
             <br />
             {shouldShowSpellcasting && <SpellcastingInfo spellcasting={selectedLevel.spellcasting} />}
            {allFeatures.map((feature) => (
                <div key={`${feature.name}-${feature.sourceLevel}`} className="feature-item class2024-feature-item">
                    <b>Level {feature.sourceLevel}: {feature.name}:</b>&nbsp;
                    {feature.type === 'subclass_feature' && (
                        <span className="subclass-badge">(Subclass)</span>
                    )}
                    {feature.description && (
                        <span dangerouslySetInnerHTML={renderHtmlContent(feature.description)} />
                    )}
                </div>
            ))}
        </div>
    );
}

export default PlayerClass2024LevelProgression;