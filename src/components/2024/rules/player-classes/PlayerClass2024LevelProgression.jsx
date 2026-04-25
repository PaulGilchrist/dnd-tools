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

    const featsContent = renderFeats2024(shownLevel);
    const energyContent = shouldShowEnergy ? renderEnergyInfo(selectedLevel.energy) : null;
    const spellcastingContent = shouldShowSpellcasting ? renderSpellcastingInfo(selectedLevel.spellcasting) : null;
    const barbarianContent = renderBarbarianInfo(selectedLevel, playerClass.name);
    const bardContent = renderBardicInfo(selectedLevel);
    const channelDivinityContent = renderChannelDivinity(selectedLevel);
    const druidContent = renderDruidInfo(selectedLevel);
    const fighterContent = renderFighterInfo(selectedLevel, playerClass.name);
    const monkContent = renderMonkInfo(selectedLevel);
    const rangerContent = renderRangerInfo(selectedLevel);
    const rogueContent = renderRogueInfo(selectedLevel);
    const sorcererContent = renderSorcererInfo(selectedLevel);

    return (
        <div className="selected-level-features">
            <b>Proficiency:</b> +{selectedLevel.proficiency_bonus}<br />
            {/* Feats */}
            {featsContent && <><>{featsContent}</><br /></>}
            {/* Barbarian Info - Rages, Rage Damage, Weapon Mastery */}
            {barbarianContent && <><>{barbarianContent}</><br /></>}
            {/* Bard Info - Bardic Die */}
            {bardContent && <><>{bardContent}</><br /></>}
            {/* Cleric Info - Channel Divinity */}
            {channelDivinityContent && <><>{channelDivinityContent}</><br /></>}
            {/* Druid Info - Wild Shape, Beast Forms, Max CR, Fly Speed */}
            {druidContent && <><>{druidContent}</><br /></>}
            {/* Fighter Info - Second Wind, Weapon Mastery */}
            {fighterContent && <><>{fighterContent}</><br /></>}
            {/* Monk Info - Martial Arts Die, Focus Points, Unarmored Movement Increase */}
            {monkContent && <><>{monkContent}</><br /></>}
            {/* Ranger Info - Favored Enemy */}
            {rangerContent && <><>{rangerContent}</><br /></>}
            {/* Rogue Info - Sneak Attack */}
            {rogueContent && <><>{rogueContent}</><br /></>}
            {/* Sorcerer Info - Sorcery Points */}
            {sorcererContent && <><>{sorcererContent}</><br /></>}
            {/* Energy Info - only show if required_major matches shownMajor or has no required_major */}
            {energyContent && <><>{energyContent}</><br /></>}
            {/* Spellcasting Info - only show if required_major matches shownMajor or has no required_major */}
            {spellcastingContent && <><>{spellcastingContent}</><br /></>}
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

/**
 * Helper function to render Barbarian-specific information
 * Displays rages, rage damage, and weapon mastery for Barbarian class levels
 */
function renderBarbarianInfo(level, className) {
    const parts = [];

    if (level.rages) {
        parts.push(<div key="rages"><b>Rages:</b>&nbsp;{level.rages}</div>);
    }
    if (level.rage_damage) {
        parts.push(<div key="rage_damage"><b>Rage Damage:</b>&nbsp;+{level.rage_damage}</div>);
    }
    if (level.weapon_mastery && className === 'Barbarian') {
        parts.push(<div key="weapon_mastery"><b>Weapon Mastery:</b>&nbsp;{level.weapon_mastery}</div>);
    }

    if (parts.length === 0) {
        return null;
    }

    return <div>{parts}</div>;
}

/**
 * Helper function to render Bard-specific information
 * Displays the bardic die for Bard class levels
 */
function renderBardicInfo(level) {
    if (!level.bardic_die) {
        return null;
    }

    return (
        <div>
            <b>Bardic Die:</b>&nbsp;d{level.bardic_die}<br />
        </div>
    );
}

/**
 * Helper function to render Cleric-specific information
 * Displays the Channel Divinity uses for Cleric class levels
 */
function renderChannelDivinity(level) {
    if (level.channel_divinity === undefined || level.channel_divinity === null) {
        return null;
    }

    return (
        <div>
            <b>Channel Divinity:</b>&nbsp;{level.channel_divinity} use{level.channel_divinity !== 1 ? 's' : ''}<br />
        </div>
    );
}

/**
 * Helper function to render Druid-specific information
 * Displays Wild Shape, Beast Known Forms, Max CR, and Fly Speed for Druid class levels
 */
function renderDruidInfo(level) {
    const parts = [];

    if (level.wild_shape !== undefined && level.wild_shape !== null) {
        parts.push(<div key="wild_shape"><b>Wild Shape:</b>&nbsp;{level.wild_shape}</div>);
    }
    if (level.beast_known_forms !== undefined && level.beast_known_forms !== null) {
        parts.push(<div key="beast_known_forms"><b>Beast Known Forms:</b>&nbsp;{level.beast_known_forms}</div>);
    }
    if (level.beast_max_cr !== undefined && level.beast_max_cr !== null) {
        parts.push(<div key="beast_max_cr"><b>Beast Max CR:</b>&nbsp;{level.beast_max_cr}</div>);
    }
    if (level.beast_fly_speed !== undefined && level.beast_fly_speed !== null) {
        parts.push(<div key="beast_fly_speed"><b>Beast Fly Speed:</b>&nbsp;{level.beast_fly_speed}</div>);
    }

    if (parts.length === 0) {
        return null;
    }

    return <div>{parts}</div>;
}

/**
 * Helper function to render Fighter-specific information
 * Displays Second Wind uses and Weapon Mastery for Fighter class levels
 */
function renderFighterInfo(level, className) {
    const parts = [];

    if (level.second_wind !== undefined && level.second_wind !== null && level.second_wind > 0) {
        parts.push(<div key="second_wind"><b>Second Wind:</b>&nbsp;{level.second_wind} use{level.second_wind !== 1 ? 's' : ''}</div>);
    }
    if (level.weapon_mastery !== undefined && level.weapon_mastery !== null && level.weapon_mastery > 0 && className === 'Fighter') {
        parts.push(<div key="weapon_mastery"><b>Weapon Mastery:</b>&nbsp;{level.weapon_mastery}</div>);
    }

    if (parts.length === 0) {
        return null;
    }

    return <div>{parts}</div>;
}

/**
 * Helper function to render Monk-specific information
 * Displays Martial Arts Die, Focus Points, and Unarmored Movement Increase for Monk class levels
 */
function renderMonkInfo(level) {
    const parts = [];

    if (level.martial_arts_die !== undefined && level.martial_arts_die !== null) {
        parts.push(<div key="martial_arts_die"><b>Martial Arts Die:</b>&nbsp;d{level.martial_arts_die}</div>);
    }
    if (level.focus_points !== undefined && level.focus_points !== null) {
        parts.push(<div key="focus_points"><b>Focus Points:</b>&nbsp;{level.focus_points}</div>);
    }
    if (level.unarmored_movement_increase !== undefined && level.unarmored_movement_increase !== null) {
        parts.push(<div key="unarmored_movement_increase"><b>Unarmored Movement Increase:</b>&nbsp;+{level.unarmored_movement_increase} ft</div>);
    }

    if (parts.length === 0) {
        return null;
    }

    return <div>{parts}</div>;
}

/**
 * Helper function to render Ranger-specific information
 * Displays the number of Favored Enemy types for Ranger class levels
 */
function renderRangerInfo(level) {
    const parts = [];

    if (level.favored_enemy !== undefined && level.favored_enemy !== null) {
        parts.push(<div key="favored_enemy"><b>Favored Enemy:</b>&nbsp;{level.favored_enemy}</div>);
    }

    if (parts.length === 0) {
        return null;
    }

    return <div>{parts}</div>;
}

/**
 * Helper function to render Rogue-specific information
 * Displays the Sneak Attack damage dice for Rogue class levels
 */
function renderRogueInfo(level) {
    const parts = [];

    if (level.sneak_attack_num_d6 !== undefined && level.sneak_attack_num_d6 !== null) {
        parts.push(<div key="sneak_attack"><b>Sneak Attack:</b>&nbsp;{level.sneak_attack_num_d6}d6</div>);
    }

    if (parts.length === 0) {
        return null;
    }

    return <div>{parts}</div>;
}

/**
 * Helper function to render Sorcerer-specific information
 * Displays the Sorcery Points for Sorcerer class levels
 */
function renderSorcererInfo(level) {
    const parts = [];

    if (level.sorcery_points !== undefined && level.sorcery_points !== null) {
        parts.push(<div key="sorcery_points"><b>Sorcery Points:</b>&nbsp;{level.sorcery_points}</div>);
    }

    if (parts.length === 0) {
        return null;
    }

    return <div>{parts}</div>;
}

export default PlayerClass2024LevelProgression;