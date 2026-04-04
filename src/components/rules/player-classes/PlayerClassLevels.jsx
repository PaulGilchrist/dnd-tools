import { useEffect } from 'react';
import './PlayerClass.css';

// Javascript utilities (matching Angular)
const utils = {
    scrollIntoView: function(index, offset = 0) {
        const element = document.getElementById(index);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
};

function PlayerClassLevels({ playerClass, shownLevel, onShowLevel }) {
    useEffect(() => {
        if (shownLevel > 0) {
            utils.scrollIntoView(shownLevel, 120);
        }
    }, [shownLevel]);

    if (!playerClass || !playerClass.class_levels) return null;

    return (
        <>
            <div className="subtext">Choose Level</div>
            <div className="level-group">
                {playerClass.class_levels.map((level) => (
                    <div key={level.level} className="btn-group">
                        <button 
                            type="button" 
                            className={`btn btn-outline-primary btn-level ${shownLevel === level.level ? 'active' : ''}`}
                            onClick={() => onShowLevel(level.level)}
                        >
                            {level.level}
                        </button>
                    </div>
                ))}
            </div>

            {playerClass.class_levels.map((level) => (
                <div key={level.level} id={shownLevel}>
                    {level.level === shownLevel && (
                        <div className="subtext">
                            {/* Ability Score Bonuses */}
                            {level.ability_score_bonuses !== undefined && level.ability_score_bonuses > 0 && (
                                <div>
                                    <b>Ability Score Bonuses:</b>&nbsp;{level.ability_score_bonuses}<br />
                                </div>
                            )}

                            {/* Proficiency Bonus */}
                            {level.prof_bonus !== undefined && (
                                <div>
                                    <b>Proficiency Bonus:</b>&nbsp;{level.prof_bonus}<br />
                                </div>
                            )}

                            {/* Class-specific stats */}
                            {playerClass.index === 'barbarian' && (
                                <div>
                                    {level.class_specific && level.class_specific.rage_count > 0 && (
                                        <div>
                                            <b>Rage Count:</b>&nbsp;{level.class_specific.rage_count}<br />
                                        </div>
                                    )}

                                    {level.class_specific && level.class_specific.rage_damage_bonus > 0 && (
                                        <div>
                                            <b>Rage Damage Bonus:</b>&nbsp;{level.class_specific.rage_damage_bonus}<br />
                                        </div>
                                    )}

                                    {level.class_specific && level.class_specific.brutal_critical_dice > 0 && (
                                        <div>
                                            <b>Brutal Critical Dice:</b>&nbsp;{level.class_specific.brutal_critical_dice}<br />
                                        </div>
                                    )}
                                </div>
                            )}

                            {playerClass.index === 'bard' && (
                                <div>
                                    {level.class_specific && level.class_specific.bardic_inspiration_die > 0 && (
                                        <div>
                                            <b>Bardic Inspiration Die:</b>&nbsp;d{level.class_specific.bardic_inspiration_die}<br />
                                        </div>
                                    )}

                                    {level.class_specific && level.class_specific.song_of_rest_die > 0 && (
                                        <div>
                                            <b>Song of Rest Die:</b>&nbsp;d{level.class_specific.song_of_rest_die}<br />
                                        </div>
                                    )}

                                    {level.class_specific && level.class_specific.magical_secrets_max_5 > 0 && (
                                        <div>
                                            <b>Magical Secrets:</b><br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;{level.class_specific.magical_secrets_max_5} of level 5 or below<br />
                                        </div>
                                    )}

                                    {level.class_specific && level.class_specific.magical_secrets_max_7 > 0 && (
                                        <div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;{level.class_specific.magical_secrets_max_7} of level 7 or below<br />
                                        </div>
                                    )}

                                    {level.class_specific && level.class_specific.magical_secrets_max_9 > 0 && (
                                        <div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;{level.class_specific.magical_secrets_max_9} of level 9 or below<br />
                                        </div>
                                    )}
                                </div>
                            )}

                            {playerClass.index === 'cleric' && (
                                <div>
                                    {level.class_specific && level.class_specific.channel_divinity_charges > 0 && (
                                        <div>
                                            <b>Channel Divinity Charges:</b>&nbsp;{level.class_specific.channel_divinity_charges}<br />
                                        </div>
                                    )}

                                    {level.class_specific && level.class_specific.destroy_undead_cr > 0 && (
                                        <div>
                                            <b>Destroy Undead CR:</b>&nbsp;{level.class_specific.destroy_undead_cr}<br />
                                        </div>
                                    )}
                                </div>
                            )}

                            {playerClass.index === 'druid' && level.class_specific && level.class_specific.wild_shape_max_cr > 0 && (
                                <div>
                                    <b>Wild Shape Max CR:</b>&nbsp;{level.class_specific.wild_shape_max_cr}
                                    {!level.class_specific.wild_shape_swim && <span>&nbsp;(no flying of swimming speed)</span>}
                                    {level.class_specific.wild_shape_swim && !level.class_specific.wild_shape_fly && (
                                        <span>&nbsp;(no flying speed)</span>
                                    )}
                                    <br />
                                </div>
                            )}

                            {playerClass.index === 'fighter' && (
                                <div>
                                    {level.class_specific && level.class_specific.action_surges > 0 && (
                                        <div>
                                            <b>Action Surges:</b>&nbsp;{level.class_specific.action_surges}<br />
                                        </div>
                                    )}

                                    {level.class_specific && level.class_specific.indomitable_uses > 0 && (
                                        <div>
                                            <b>Indomitable Uses:</b>&nbsp;{level.class_specific.indomitable_uses}<br />
                                        </div>
                                    )}

                                    {level.class_specific && level.class_specific.extra_attacks > 0 && (
                                        <div>
                                            <b>Extra Attacks:</b>&nbsp;{level.class_specific.extra_attacks}<br />
                                        </div>
                                    )}
                                </div>
                            )}

                            {playerClass.index === 'monk' && (
                                <div>
                                    {level.class_specific && level.class_specific.martial_arts && (
                                        <div>
                                            <b>Martial Arts:</b>&nbsp;{level.class_specific.martial_arts.dice_count}d{level.class_specific.martial_arts.dice_value}<br />
                                        </div>
                                    )}

                                    {level.class_specific && level.class_specific.ki_points > 0 && (
                                        <div>
                                            <b>Ki Points:</b>&nbsp;{level.class_specific.ki_points}<br />
                                        </div>
                                    )}

                                    {level.class_specific && level.class_specific.unarmored_movement > 0 && (
                                        <div>
                                            <b>Unarmored Movement:</b>&nbsp;{level.class_specific.unarmored_movement}<br />
                                        </div>
                                    )}
                                </div>
                            )}

                            {playerClass.index === 'paladin' && level.class_specific && level.class_specific.aura_range > 0 && (
                                <div>
                                    <b>Aura Range:</b>&nbsp;{level.class_specific.aura_range}<br />
                                </div>
                            )}

                            {playerClass.index === 'ranger' && (
                                <div>
                                    {level.class_specific && level.class_specific.favored_enemies > 0 && (
                                        <div>
                                            <b>Favored Enemies:</b>&nbsp;{level.class_specific.favored_enemies}<br />
                                        </div>
                                    )}

                                    {level.class_specific && level.class_specific.favored_terrain > 0 && (
                                        <div>
                                            <b>Favored Terrain:</b>&nbsp;{level.class_specific.favored_terrain}<br />
                                        </div>
                                    )}
                                </div>
                            )}

                            {playerClass.index === 'rogue' && (
                                <div>
                                    {level.class_specific && level.class_specific.sneak_attack && (
                                        <div>
                                            <b>Sneak Attack:</b>&nbsp;{level.class_specific.sneak_attack.dice_count}d{level.class_specific.sneak_attack.dice_value}<br />
                                        </div>
                                    )}
                                </div>
                            )}

                            {playerClass.index === 'sorcerer' && (
                                <div>
                                    {level.class_specific && level.class_specific.sorcery_points > 0 && (
                                        <div>
                                            <b>Sorcery Points:</b>&nbsp;{level.class_specific.sorcery_points}<br />
                                        </div>
                                    )}

                                    {level.class_specific && level.class_specific.metamagic_known > 0 && (
                                        <div>
                                            <b>Metamagic Known:</b>&nbsp;{level.class_specific.metamagic_known}<br />
                                        </div>
                                    )}

                                    {level.class_specific && level.class_specific.creating_spell_slots && level.class_specific.creating_spell_slots.length > 0 && (
                                        <div>
                                            <b>Creating Spell Slots:</b><br />
                                            {level.class_specific.creating_spell_slots.map((spellSlot, index) => (
                                                <span key={index}>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;Level {spellSlot.spell_slot_level} Point Cost = {spellSlot.sorcery_point_cost}<br />
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {playerClass.index === 'warlock' && (
                                <div>
                                    {level.class_specific && level.class_specific.invocations_known > 0 && (
                                        <div>
                                            <b>Invocations Known:</b>&nbsp;{level.class_specific.invocations_known}<br />
                                        </div>
                                    )}

                                    {(level.class_specific.mystic_arcanum_level_6 > 0 || level.class_specific.mystic_arcanum_level_7 > 0 || 
                                      level.class_specific.mystic_arcanum_level_8 > 0 || level.class_specific.mystic_arcanum_level_9 > 0) && (
                                        <div>
                                            <b>Mystic Arcanum:</b><br />
                                            {level.class_specific.mystic_arcanum_level_6 > 0 && (
                                                <div>&nbsp;&nbsp;&nbsp;&nbsp;Level 6 = {level.class_specific.mystic_arcanum_level_6}<br /></div>
                                            )}
                                            {level.class_specific.mystic_arcanum_level_7 > 0 && (
                                                <div>&nbsp;&nbsp;&nbsp;&nbsp;Level 7 = {level.class_specific.mystic_arcanum_level_7}<br /></div>
                                            )}
                                            {level.class_specific.mystic_arcanum_level_8 > 0 && (
                                                <div>&nbsp;&nbsp;&nbsp;&nbsp;Level 8 = {level.class_specific.mystic_arcanum_level_8}<br /></div>
                                            )}
                                            {level.class_specific.mystic_arcanum_level_9 > 0 && (
                                                <div>&nbsp;&nbsp;&nbsp;&nbsp;Level 9 = {level.class_specific.mystic_arcanum_level_9}<br /></div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {playerClass.index === 'wizard' && (
                                <div>
                                    {level.class_specific && level.class_specific.arcane_recovery_levels > 0 && (
                                        <div>
                                            <b>Arcane Recovery Levels:</b>&nbsp;{level.class_specific.arcane_recovery_levels}<br />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Spellcasting */}
                            {level.spellcasting && (
                                <div>
                                    {level.spellcasting.cantrips_known > 0 && (
                                        <div>
                                            <b>Cantrips Known:</b>&nbsp;{level.spellcasting.cantrips_known}<br />
                                        </div>
                                    )}

                                    {level.spellcasting.spells_known > 0 && (
                                        <div>
                                            <b>Spells Known:</b>&nbsp;{level.spellcasting.spells_known}<br />
                                        </div>
                                    )}

                                    {level.spellcasting.spell_slots_level_1 > 0 && (
                                        <div>
                                            <b>Spell Slots:</b><br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;{level.spellcasting.spell_slots_level_1} of level 1<br />
                                        </div>
                                    )}

                                    {level.spellcasting.spell_slots_level_2 > 0 && (
                                        <div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;{level.spellcasting.spell_slots_level_2} of level 2<br />
                                        </div>
                                    )}

                                    {level.spellcasting.spell_slots_level_3 > 0 && (
                                        <div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;{level.spellcasting.spell_slots_level_3} of level 3<br />
                                        </div>
                                    )}

                                    {level.spellcasting.spell_slots_level_4 > 0 && (
                                        <div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;{level.spellcasting.spell_slots_level_4} of level 4<br />
                                        </div>
                                    )}

                                    {level.spellcasting.spell_slots_level_5 > 0 && (
                                        <div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;{level.spellcasting.spell_slots_level_5} of level 5<br />
                                        </div>
                                    )}

                                    {level.spellcasting.spell_slots_level_6 > 0 && (
                                        <div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;{level.spellcasting.spell_slots_level_6} of level 6<br />
                                        </div>
                                    )}

                                    {level.spellcasting.spell_slots_level_7 > 0 && (
                                        <div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;{level.spellcasting.spell_slots_level_7} of level 7<br />
                                        </div>
                                    )}

                                    {level.spellcasting.spell_slots_level_8 > 0 && (
                                        <div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;{level.spellcasting.spell_slots_level_8} of level 8<br />
                                        </div>
                                    )}

                                    {level.spellcasting.spell_slots_level_9 > 0 && (
                                        <div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;{level.spellcasting.spell_slots_level_9} of level 9<br />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </>
    );
}

export default PlayerClassLevels;
