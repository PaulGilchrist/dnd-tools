import React from 'react';
import { SingleInfo, ClassInfo, SpellSlotsInfo } from './ClassInfoComponents';

// Generic field configs for single-value properties
const singleFieldConfigs = {
    rage_damage: { field: 'rage_damage', label: 'Rage Damage', prefix: '+', suffix: '' },
    channel_divinity: { field: 'channel_divinity', label: 'Channel Divinity' },
    wild_shape: { field: 'wild_shape', label: 'Wild Shape' },
    beast_known_forms: { field: 'beast_known_forms', label: 'Beast Known Forms' },
    beast_max_cr: { field: 'beast_max_cr', label: 'Beast Max CR' },
    beast_fly_speed: { field: 'beast_fly_speed', label: 'Beast Fly Speed' },
    favored_enemy: { field: 'favored_enemy', label: 'Favored Enemy' },
    sorcery_points: { field: 'sorcery_points', label: 'Sorcery Points' },
    eldritch_invocations: { field: 'eldritch_invocations', label: 'Eldritch Invocations' },
};

// Generic field configs for multi-value properties
const multiFieldConfigs = {
    barbarian: [
        { field: 'rages', label: 'Rages' },
        singleFieldConfigs.rage_damage,
        { field: 'weapon_mastery', label: 'Weapon Mastery', condition: (level) => level.weapon_mastery && 'Fighter' !== 'Fighter' },
    ],
    fighter: [
        { field: 'second_wind', label: 'Second Wind' },
        { field: 'weapon_mastery', label: 'Weapon Mastery' },
    ],
    monk: [
        { field: 'martial_arts_die', label: 'Martial Arts Die', prefix: 'd' },
        { field: 'focus_points', label: 'Focus Points' },
        { field: 'unarmored_movement_increase', label: 'Unarmored Movement Increase', prefix: '+', suffix: ' ft' },
    ],
    druid: [
        { field: 'wild_shape', label: 'Wild Shape' },
        { field: 'beast_known_forms', label: 'Beast Known Forms' },
        { field: 'beast_max_cr', label: 'Beast Max CR' },
        { field: 'beast_fly_speed', label: 'Beast Fly Speed' },
    ],
};

// Spell slot config: renders slots from 1 to maxLevel
const spellSlotConfig = { maxLevel: 9 };

// Feat calculation: origin + general + epic boon
function Feats2024({ level }) {
    if (!level || level < 1) return null;
    const parts = ['1 Origin'];
    const generalFeats = [4, 8, 12, 16].filter(f => level >= f).length;
    if (generalFeats > 0) parts.push(`${generalFeats} General`);
    if (level >= 19) parts.push('1 Epic Boon');
    if (parts.length === 0) return null;
    return <div><b>Feats:</b>&nbsp;{parts.join(', ')}<br /></div>;
}

// EnergyInfo: formats energy_die_num + energy_die_type as "XdY" — kept standalone
function EnergyInfo({ energy }) {
    if (!energy?.energy_die_type || !energy.energy_die_num) return null;
    return (
        <div>
            <b>Energy:</b>&nbsp;{energy.energy_die_num}d{energy.energy_die_type}<br />
        </div>
    );
}

// Spellcasting: generic spell slots
function SpellcastingInfo({ spellcasting }) {
    if (!spellcasting) return null;
    return <SpellSlotsInfo spellcasting={spellcasting} config={spellSlotConfig} />;
}

// Class-specific wrappers using generic ClassInfo
function BarbarianInfo({ level }) {
    return <ClassInfo level={level} config={{ fields: multiFieldConfigs.barbarian }} />;
}
function BardicInfo({ level }) {
    return <SingleInfo level={level} config={{ field: 'bardic_die', label: 'Bardic Die', prefix: 'd' }} />;
}
function DruidInfo({ level }) {
    return <ClassInfo level={level} config={{ fields: multiFieldConfigs.druid }} />;
}
function FighterInfo({ level }) {
    return <ClassInfo level={level} config={{ fields: multiFieldConfigs.fighter }} />;
}
function MonkInfo({ level }) {
    return <ClassInfo level={level} config={{ fields: multiFieldConfigs.monk }} />;
}
function RangerInfo({ level }) {
    return <SingleInfo level={level} config={singleFieldConfigs.favored_enemy} />;
}
function RogueInfo({ level }) {
    return <SingleInfo level={level} config={{ field: 'sneak_attack_num_d6', label: 'Sneak Attack', suffix: 'd6' }} />;
}
function SorcererInfo({ level }) {
    return <SingleInfo level={level} config={singleFieldConfigs.sorcery_points} />;
}
function WarlockInfo({ level }) {
    return <SingleInfo level={level} config={singleFieldConfigs.eldritch_invocations} />;
}
// ChannelDivinity: conditional suffix (use vs uses) — kept standalone
function ChannelDivinity({ level }) {
    if (level?.channel_divinity === undefined || level?.channel_divinity === null) return null;
    return (
        <div>
            <b>Channel Divinity:</b>&nbsp;{level.channel_divinity} use{level.channel_divinity !== 1 ? 's' : ''}<br />
        </div>
    );
}
// ExtraAttacks: generic single-field
function ExtraAttacks({ level }) {
    if (level?.extra_attacks > 0) {
        return <SingleInfo level={level} config={{ field: 'extra_attacks', label: 'Extra Attacks' }} />;
    }
    return null;
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
