import React from 'react';
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
                  <AllLevelsView playerClass={playerClass} shownMajor={shownMajor} />
              ) : (
                  <SelectedLevelView playerClass={playerClass} shownLevel={shownLevel} shownMajor={shownMajor} />
              )}
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
                <b>Proficiency:</b> +{selectedLevel.proficiency_bonus}<br/>
                {/* Feats */}
                {renderFeats2024(shownLevel)}<br/>
                {/* Energy Info - only show if required_major matches shownMajor or has no required_major */}
                {shouldShowEnergy && renderEnergyInfo(selectedLevel.energy)}<br/>
                {/* Spellcasting Info - only show if required_major matches shownMajor or has no required_major */}
                {shouldShowSpellcasting && renderSpellcastingInfo(selectedLevel.spellcasting)}<br/>
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
 * Component to display features for all levels
 */
function AllLevelsView({ playerClass, shownMajor }) {
    return (
        <div className="all-levels-features">
            {playerClass.class_levels.map((level) => {
                // Check if energy should be shown for this level
               const shouldShowEnergy = level.energy && (
                    !level.energy.required_major || 
                   level.energy.required_major === shownMajor
                  );

               // Check if spellcasting should be shown for this level
               const shouldShowSpellcasting = level.spellcasting && (
                    !level.spellcasting.required_major || 
                    level.spellcasting.required_major === shownMajor
                  );

                return (
                    <div key={level.level} className="level-section">
                        <h5>Level {level.level}</h5>
                        <b>Proficiency:</b> +{level.proficiency_bonus}<br/>
                        {renderFeats2024(level.level)}<br/>
                        {/* Energy Info - only show if required_major matches shownMajor or has no required_major */}
                        {shouldShowEnergy && renderEnergyInfo(level.energy)}<br/>
                        {/* Spellcasting Info - only show if required_major matches shownMajor or has no required_major */}
                        {shouldShowSpellcasting && renderSpellcastingInfo(level.spellcasting)}<br/>
                        {level.features && level.features.map((feature, fIndex) => (
                            <div key={fIndex} className="feature-item class2024-feature-item">
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
                );
            })}
        </div>
    );
}

/**
 * Helper function to render feat information for 2024 rules
 * - Origin feat at level 1 (based on background)
 * - General feats at levels 4, 8, 12, and 16
 * - Epic Boon at level 19
 */
function renderFeats2024(level) {
    if (!level || level < 1) {
        return null;
      }

    const parts = [];

    // Origin feat at level 1
    if (level >= 1) {
        parts.push('1 Origin');
      }

    // General feats at levels 4, 8, 12, 16
    const generalFeatLevels = [4, 8, 12, 16];
    const generalFeats = generalFeatLevels.filter(featLevel => level >= featLevel).length;
    if (generalFeats > 0) {
        parts.push(`${generalFeats} General`);
      }

    // Epic Boon at level 19
    if (level >= 19) {
        parts.push('1 Epic Boon');
      }

    if (parts.length === 0) {
        return null;
      }

    return (
          <div>
              <b>Feats:</b>&nbsp;{parts.join(', ')}<br />
          </div>
      );
}

/**
 * Helper function to render energy information
 * Displays the energy die for subclasses like Psi Warrior
 */
function renderEnergyInfo(energy) {
    if (!energy || !energy.energy_die_type || !energy.energy_die_num) {
        return null;
       }

    return (
         <div>
              <b>Energy:</b>&nbsp;{energy.energy_die_num}d{energy.energy_die_type}<br />
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

            {spellcasting.prepared_spells > 0 && (
                <div>
                    <b>Prepared Spells:</b>&nbsp;{spellcasting.prepared_spells}<br />
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