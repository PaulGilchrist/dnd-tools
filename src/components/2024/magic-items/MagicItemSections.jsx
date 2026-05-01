import React from 'react';
import { renderHtmlContent } from '../../../utils/htmlUtils';

/**
 * Helper function to render charge system info
 */
function ChargeSystem({ magicItem }) {
    if (!magicItem.charge_system) return null;
    
    const charges = magicItem.charge_system;
    const parts = [];
    
    if (charges.total_charges) {
        parts.push(`Has ${charges.total_charges} charges`);
     }
    if (charges.regain_type) {
        parts.push(`Regains ${charges.regain_type}`);
     }
    if (charges.regain_formula) {
        parts.push(`(${charges.regain_formula})`);
     }
    if (charges.destroy_on_exhaust) {
        parts.push('<span class="text-danger">Destroyed when last charge expended</span>');
     }
    if (charges.recovery_on_exhaust) {
        parts.push('<span class="text-success">Chance to recover charges when last charge expended</span>');
     }
    
    return <div><b>Charge System:</b> {parts.join(' ')}</div>;
}

/**
 * Helper function to render spell casting info
 */
function SpellCasting({ magicItem }) {
    if (!magicItem.spell_casting) return null;
    
    const { save_dc, attack_bonus, spells } = magicItem.spell_casting;
    const parts = [];
    
    if (save_dc) {
        parts.push(`<b>Save DC:</b> ${save_dc}`);
     }
    if (attack_bonus) {
        parts.push(`<b>Spell Attack Bonus:</b> ${attack_bonus}`);
     }
    
    if (spells && spells.length > 0) {
        parts.push('<b>Spells:</b>');
        spells.forEach(spell => {
            parts.push(`- ${spell.name} (${spell.level} level, ${spell.charge_cost} charge${spell.charge_cost > 1 ? 's' : ''})`);
          });
      }
    
    return <div dangerouslySetInnerHTML={renderHtmlContent(parts.join('<br />'))} />;
}

/**
 * Helper function to render damage info
 */
function Damage({ magicItem }) {
    if (!magicItem.damage) return null;
    
    const { damage_dice, damage_type, extra_damage } = magicItem.damage;
    const parts = [];
    
    if (damage_dice) {
        parts.push(`<b>Damage:</b> ${damage_dice} ${damage_type}`);
     }
    if (extra_damage) {
        parts.push(`<b>Extra Damage:</b> ${extra_damage}`);
     }
    
    return <div dangerouslySetInnerHTML={renderHtmlContent(parts.join('<br />'))} />;
}

/**
 * Helper function to render saving throws
 */
function SavingThrows({ magicItem }) {
    if (!magicItem.saving_throws || magicItem.saving_throws.length === 0) return null;
    
    const parts = ['<b>Saving Throws:</b>'];
    magicItem.saving_throws.forEach(st => {
        parts.push(`DC ${st.dc} ${st.ability}: ${st.effect_on_fail}`);
        if (st.effect_on_success) {
            parts.push(`    (Success: ${st.effect_on_success})`);
          }
      });
    
    return <div dangerouslySetInnerHTML={renderHtmlContent(parts.join('<br />'))} />;
}

/**
 * Helper function to render bonuses
 */
function Bonuses({ magicItem }) {
    if (!magicItem.bonuses) return null;
    
    const { attack_bonus, damage_bonus, ac_bonus, saving_throw_bonus, ability_check_bonus, ability_score_increase } = magicItem.bonuses;
    const parts = ['<b>Bonuses:</b>'];
    
    if (attack_bonus) parts.push(`<b>Attack Bonus:</b> +${attack_bonus}`);
    if (damage_bonus) parts.push(`<b>Damage Bonus:</b> +${damage_bonus}`);
    if (ac_bonus) parts.push(`<b>AC Bonus:</b> +${ac_bonus}`);
    if (saving_throw_bonus) parts.push(`<b>Saving Throw Bonus:</b> +${saving_throw_bonus}`);
    if (ability_check_bonus) parts.push(`<b>Ability Check Bonus:</b> +${ability_check_bonus}`);
    
    if (ability_score_increase) {
        parts.push(`<b>Ability Score Increase:</b> +${ability_score_increase.amount} to ${ability_score_increase.ability} (max ${ability_score_increase.maximum})`);
     }
    
    return <div dangerouslySetInnerHTML={renderHtmlContent(parts.join('<br />'))} />;
}

/**
 * Helper function to render advantage/disadvantage
 */
function AdvantageDisadvantage({ magicItem }) {
    if (!magicItem.advantage_disadvantage) return null;
    
    const { advantage_on, disadvantage_on } = magicItem.advantage_disadvantage;
    const parts = [];
    
    if (advantage_on && advantage_on.length > 0) {
        parts.push(`<b>Advantage on:</b> ${advantage_on.join(', ')}`);
     }
    if (disadvantage_on && disadvantage_on.length > 0) {
        parts.push(`<b>Disadvantage on:</b> ${disadvantage_on.join(', ')}`);
     }
    
    return parts.length > 0 ? <div dangerouslySetInnerHTML={renderHtmlContent(parts.join('<br />'))} /> : null;
}

/**
 * Helper function to render conditions
 */
function Conditions({ magicItem }) {
    if (!magicItem.conditions || magicItem.conditions.length === 0) return null;
    
    return <div><b>Conditions:</b> {magicItem.conditions.join(', ')}</div>;
}

/**
 * Helper function to render resistances/immunities
 */
function ResistancesImmunities({ magicItem }) {
    const parts = [];
    
    if (magicItem.resistances && magicItem.resistances.length > 0) {
        parts.push(`<b>Resistances:</b> ${magicItem.resistances.join(', ')}`);
     }
    if (magicItem.immunities && magicItem.immunities.length > 0) {
        parts.push(`<b>Immunities:</b> ${magicItem.immunities.join(', ')}`);
     }
    
    return parts.length > 0 ? <div dangerouslySetInnerHTML={renderHtmlContent(parts.join('<br />'))} /> : null;
}

/**
 * Helper function to render curse info
 */
function Curse({ magicItem }) {
    if (!magicItem.curse) return null;
    
    const { description, removal } = magicItem.curse;
    return (
          <div className="text-danger">
              <b>Curse:</b><br />
              {description}<br />
              {removal && <small><i>Removal: {removal}</i></small>}
          </div>
      );
}

/**
 * Helper function to render sentience info
 */
function Sentience({ magicItem }) {
    if (!magicItem.sentience) return null;
    
    const { alignment, intelligence, wisdom, charisma, languages, personality, purpose, communication } = magicItem.sentience;
    const parts = [];
    
    if (alignment) parts.push(`<b>Alignment:</b> ${alignment}`);
    if (intelligence) parts.push(`<b>Intelligence:</b> ${intelligence}`);
    if (wisdom) parts.push(`<b>Wisdom:</b> ${wisdom}`);
    if (charisma) parts.push(`<b>Charisma:</b> ${charisma}`);
    if (languages) parts.push(`<b>Languages:</b> ${languages.join(', ')}`);
    if (personality) parts.push(`<b>Personality:</b> ${personality}`);
    if (purpose) parts.push(`<b>Purpose:</b> ${purpose}`);
    if (communication) parts.push(`<b>Communication:</b> ${communication}`);
    
    return <div dangerouslySetInnerHTML={renderHtmlContent(parts.join('<br />'))} />;
}

/**
 * Helper function to render item slot info
 */
function ItemSlot({ magicItem }) {
    if (!magicItem.item_slot) return null;
    
    return <div><b>Item Slot:</b> {magicItem.item_slot}</div>;
}

/**
 * Helper function to render usage limit
 */
function UsageLimit({ magicItem }) {
    if (!magicItem.usage_limit) return null;
    
    return <div><b>Usage Limit:</b> {magicItem.usage_limit}</div>;
}

/**
 * Helper function to render duration
 */
function Duration({ magicItem }) {
    if (!magicItem.duration) return null;
    
    return <div><b>Duration:</b> {magicItem.duration}</div>;
}

/**
 * Helper function to render action types
 */
function ActionTypes({ magicItem }) {
    if (!magicItem.action_types || magicItem.action_types.length === 0) return null;
    
    return <div><b>Action Types:</b> {magicItem.action_types.join(', ')}</div>;
}

/**
 * Helper function to render properties list
 */
function Properties({ magicItem }) {
    if (!magicItem.properties || magicItem.properties.length === 0) return null;
    
    return <div><b>Properties:</b> {magicItem.properties.join(', ')}</div>;
}

/**
 * Helper function to render attunement requirements
 */
function AttunementRequirements({ magicItem }) {
    if (!magicItem.attunement_requirements) return null;
    
    return <div><b>Attunement Requirement:</b> {magicItem.attunement_requirements}</div>;
}

export {
    ChargeSystem,
    SpellCasting,
    Damage,
    SavingThrows,
    Bonuses,
    AdvantageDisadvantage,
    Conditions,
    ResistancesImmunities,
    Curse,
    Sentience,
    ItemSlot,
    UsageLimit,
    Duration,
    ActionTypes,
    Properties,
    AttunementRequirements
};