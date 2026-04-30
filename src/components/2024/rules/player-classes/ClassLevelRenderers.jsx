import React from 'react';

/**
 * Helper function to render feat information for 2024 rules
 * - Origin feat at level 1 (based on background)
 * - General feats at levels 4, 8, 12, and 16
 * - Epic Boon at level 19
 */
function Feats2024({ level }) {
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
 * Helper function to render Extra Attacks information
 * Displays the number of extra attacks for classes that have this feature (Fighter, Barbarian, Monk, Paladin, Ranger)
 */
function ExtraAttacks({ level }) {
    const parts = [];

    if (level.extra_attacks !== undefined && level.extra_attacks !== null && level.extra_attacks > 0) {
        parts.push(<div key="extra_attacks"><b>Extra Attacks:</b>&nbsp;{level.extra_attacks}</div>);
    }

    if (parts.length === 0) {
        return null;
    }

    return <div>{parts}</div>;
}

/**
 * Helper function to render energy information
 * Displays the energy die for subclasses like Psi Warrior
 */
function EnergyInfo({ energy }) {
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
function SpellcastingInfo({ spellcasting }) {
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
function BarbarianInfo({ level, className }) {
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
function BardicInfo({ level }) {
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
function ChannelDivinity({ level }) {
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
function DruidInfo({ level }) {
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
function FighterInfo({ level, className }) {
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
function MonkInfo({ level }) {
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
function RangerInfo({ level }) {
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
function RogueInfo({ level }) {
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
function SorcererInfo({ level }) {
    const parts = [];

    if (level.sorcery_points !== undefined && level.sorcery_points !== null) {
        parts.push(<div key="sorcery_points"><b>Sorcery Points:</b>&nbsp;{level.sorcery_points}</div>);
    }

    if (parts.length === 0) {
        return null;
    }

    return <div>{parts}</div>;
}

/**
 * Helper function to render Warlock-specific information
 * Displays the Eldritch Invocations for Warlock class levels
 */
function WarlockInfo({ level }) {
    const parts = [];

    if (level.eldritch_invocations !== undefined && level.eldritch_invocations !== null) {
        parts.push(<div key="eldritch_invocations"><b>Eldritch Invocations:</b>&nbsp;{level.eldritch_invocations}</div>);
    }

    if (parts.length === 0) {
        return null;
    }

    return <div>{parts}</div>;
}

export {
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
};