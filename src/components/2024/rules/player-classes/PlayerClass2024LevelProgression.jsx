import React from 'react';
import './PlayerClass2024LevelProgression.css';

/**
 * Component to display the level progression with a selector
 */
function PlayerClass2024LevelProgression({ playerClass, shownLevel, onShowLevel }) {
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
                        className={`btn btn-sm ${shownLevel === level.level ? 'btn-primary' : 'btn-outline-secondary'}`}
                        className={`btn btn-sm ${shownLevel === level.level ? 'btn-primary' : 'btn-outline-secondary'} class2024-level-selector-btn`}
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
            <b>Proficiency:</b> {selectedLevel.proficiency_bonus}
            {/* Spellcasting Info */}
            {selectedLevel.spellcasting && renderSpellcastingInfo(selectedLevel.spellcasting)}<br/>
            {allFeatures.map((feature, fIndex) => (
                <div key={fIndex} className="feature-item class2024-feature-item">
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

/**
 * Helper function to render spellcasting information
 * Uses existing 5E styling classes for consistency
 */
function renderSpellcastingInfo(spellcasting) {
    const slots = [];

    if (spellcasting.spell_slots_level_1 > 0) {
        slots.push(<div key="level1">&nbsp;&nbsp;&nbsp;&nbsp;{spellcasting.spell_slots_level_1} of level 1</div>);
    }
    if (spellcasting.spell_slots_level_2 > 0) {
        slots.push(<div key="level2">&nbsp;&nbsp;&nbsp;&nbsp;{spellcasting.spell_slots_level_2} of level 2</div>);
    }
    if (spellcasting.spell_slots_level_3 > 0) {
        slots.push(<div key="level3">&nbsp;&nbsp;&nbsp;&nbsp;{spellcasting.spell_slots_level_3} of level 3</div>);
    }
    if (spellcasting.spell_slots_level_4 > 0) {
        slots.push(<div key="level4">&nbsp;&nbsp;&nbsp;&nbsp;{spellcasting.spell_slots_level_4} of level 4</div>);
    }
    if (spellcasting.spell_slots_level_5 > 0) {
        slots.push(<div key="level5">&nbsp;&nbsp;&nbsp;&nbsp;{spellcasting.spell_slots_level_5} of level 5</div>);
    }
    if (spellcasting.spell_slots_level_6 > 0) {
        slots.push(<div key="level6">&nbsp;&nbsp;&nbsp;&nbsp;{spellcasting.spell_slots_level_6} of level 6</div>);
    }
    if (spellcasting.spell_slots_level_7 > 0) {
        slots.push(<div key="level7">&nbsp;&nbsp;&nbsp;&nbsp;{spellcasting.spell_slots_level_7} of level 7</div>);
    }
    if (spellcasting.spell_slots_level_8 > 0) {
        slots.push(<div key="level8">&nbsp;&nbsp;&nbsp;&nbsp;{spellcasting.spell_slots_level_8} of level 8</div>);
    }
    if (spellcasting.spell_slots_level_9 > 0) {
        slots.push(<div key="level9">&nbsp;&nbsp;&nbsp;&nbsp;{spellcasting.spell_slots_level_9} of level 9</div>);
    }

    return (
        <div className="playerClass-margin-bottom-small">
            {spellcasting.cantrips_known > 0 && (
                <div>
                    <b>Cantrips Known:</b>&nbsp;{spellcasting.cantrips_known}<br />
                </div>
            )}

            {spellcasting.spells_known > 0 && (
                <div>
                    <b>Spells Known:</b>&nbsp;{spellcasting.spells_known}<br />
                </div>
            )}

            {slots.length > 0 && (
                <div>
                    <b>Spell Slots:</b><br />
                    {slots}
                </div>
            )}
        </div>
    );
}

export default PlayerClass2024LevelProgression;