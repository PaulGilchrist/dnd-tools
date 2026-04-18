import { useState, useEffect } from 'react';

function MagicItem2024({ magicItem, expand, onExpand, onBookmarkChange }) {
    const [isExpanded, setIsExpanded] = useState(expand);

    // Update local state when prop changes
    useEffect(() => {
        if (expand !== isExpanded) {
            setIsExpanded(expand);
        }
    }, [expand]);

    const toggleDetails = () => {
        setIsExpanded(!isExpanded);
        onExpand(!isExpanded);
    };

    const toggleBookmark = () => {
        magicItem.bookmarked = !magicItem.bookmarked;
        onBookmarkChange(magicItem.index, magicItem.bookmarked);
    };

    const handleCheckboxChange = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        magicItem.bookmarked = e.target.checked;
        onBookmarkChange(magicItem.index, magicItem.bookmarked);
    };

    const handleLabelClick = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };

    if (!magicItem) {
        return null;
    }

    // Helper function to render charge system info
    const renderChargeSystem = () => {
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
    };

    // Helper function to render spell casting info
    const renderSpellCasting = () => {
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
        
        return <div dangerouslySetInnerHTML={{ __html: parts.join('<br />') }} />;
    };

    // Helper function to render damage info
    const renderDamage = () => {
        if (!magicItem.damage) return null;
        
        const { damage_dice, damage_type, extra_damage } = magicItem.damage;
        const parts = [];
        
        if (damage_dice) {
            parts.push(`<b>Damage:</b> ${damage_dice} ${damage_type}`);
        }
        if (extra_damage) {
            parts.push(`<b>Extra Damage:</b> ${extra_damage}`);
        }
        
        return <div dangerouslySetInnerHTML={{ __html: parts.join('<br />') }} />;
    };

    // Helper function to render saving throws
    const renderSavingThrows = () => {
        if (!magicItem.saving_throws || magicItem.saving_throws.length === 0) return null;
        
        const parts = ['<b>Saving Throws:</b>'];
        magicItem.saving_throws.forEach(st => {
            parts.push(`DC ${st.dc} ${st.ability}: ${st.effect_on_fail}`);
            if (st.effect_on_success) {
                parts.push(`  (Success: ${st.effect_on_success})`);
            }
        });
        
        return <div dangerouslySetInnerHTML={{ __html: parts }} />;
    };

    // Helper function to render bonuses
    const renderBonuses = () => {
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
        
        return <div dangerouslySetInnerHTML={{ __html: parts.join('<br />') }} />;
    };

    // Helper function to render advantage/disadvantage
    const renderAdvantageDisadvantage = () => {
        if (!magicItem.advantage_disadvantage) return null;
        
        const { advantage_on, disadvantage_on } = magicItem.advantage_disadvantage;
        const parts = [];
        
        if (advantage_on && advantage_on.length > 0) {
            parts.push(`<b>Advantage on:</b> ${advantage_on.join(', ')}`);
        }
        if (disadvantage_on && disadvantage_on.length > 0) {
            parts.push(`<b>Disadvantage on:</b> ${disadvantage_on.join(', ')}`);
        }
        
        return parts.length > 0 ? <div dangerouslySetInnerHTML={{ __html: parts.join('<br />') }} /> : null;
    };

    // Helper function to render conditions
    const renderConditions = () => {
        if (!magicItem.conditions || magicItem.conditions.length === 0) return null;
        
        return <div><b>Conditions:</b> {magicItem.conditions.join(', ')}</div>;
    };

    // Helper function to render resistances/immunities
    const renderResistancesImmunities = () => {
        const parts = [];
        
        if (magicItem.resistances && magicItem.resistances.length > 0) {
            parts.push(`<b>Resistances:</b> ${magicItem.resistances.join(', ')}`);
        }
        if (magicItem.immunities && magicItem.immunities.length > 0) {
            parts.push(`<b>Immunities:</b> ${magicItem.immunities.join(', ')}`);
        }
        
        return parts.length > 0 ? <div dangerouslySetInnerHTML={{ __html: parts.join('<br />') }} /> : null;
    };

    // Helper function to render curse info
    const renderCurse = () => {
        if (!magicItem.curse) return null;
        
        const { description, removal } = magicItem.curse;
        return (
            <div className="text-danger">
                <b>Curse:</b><br />
                {description}<br />
                {removal && <small><i>Removal: {removal}</i></small>}
            </div>
        );
    };

    // Helper function to render sentience info
    const renderSentience = () => {
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
        
        return <div dangerouslySetInnerHTML={{ __html: parts.join('<br />') }} />;
    };

    // Helper function to render item slot info
    const renderItemSlot = () => {
        if (!magicItem.item_slot) return null;
        
        return <div><b>Item Slot:</b> {magicItem.item_slot}</div>;
    };

    // Helper function to render usage limit
    const renderUsageLimit = () => {
        if (!magicItem.usage_limit) return null;
        
        return <div><b>Usage Limit:</b> {magicItem.usage_limit}</div>;
    };

    // Helper function to render duration
    const renderDuration = () => {
        if (!magicItem.duration) return null;
        
        return <div><b>Duration:</b> {magicItem.duration}</div>;
    };

    // Helper function to render action types
    const renderActionTypes = () => {
        if (!magicItem.action_types || magicItem.action_types.length === 0) return null;
        
        return <div><b>Action Types:</b> {magicItem.action_types.join(', ')}</div>;
    };

    // Helper function to render properties list
    const renderProperties = () => {
        if (!magicItem.properties || magicItem.properties.length === 0) return null;
        
        return <div><b>Properties:</b> {magicItem.properties.join(', ')}</div>;
    };

    // Helper function to render attunement requirements
    const renderAttunementRequirements = () => {
        if (!magicItem.attunement_requirements) return null;
        
        return <div><b>Attunement Requirement:</b> {magicItem.attunement_requirements}</div>;
    };

    return (
        <div className={`card w-100 ${isExpanded ? 'active' : ''}`} id={magicItem.index} data-item-index={magicItem.index}>
            <div className="card-header clickable">
                <div onClick={toggleDetails}>
                    <div className="card-title">{magicItem.name}</div>
                    <div>
                        <i>{magicItem.type}, {magicItem.rarity}</i>
                        {magicItem.requiresAttunement && (
                            <span>, Requires Attunement</span>
                        )}
                        {magicItem.subtype && (
                            <span>, {magicItem.subtype}</span>
                        )}
                    </div>
                </div>
                <div className="form-check">
                    <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id={`bookmarked-${magicItem.index}`}
                        checked={magicItem.bookmarked || false}
                        onChange={handleCheckboxChange}
                    />
                    <label 
                        className="form-check-label" 
                        htmlFor={`bookmarked-${magicItem.index}`}
                        onClick={handleLabelClick}
                    >
                        Bookmarked
                    </label>
                </div>
            </div>

            {isExpanded && (
                <div className="card-body">
                    <div className="card-text">
                        {/* Description */}
                        {magicItem.description && (
                            <div>
                                <b>Description:</b><br />
                                <div dangerouslySetInnerHTML={{ __html: magicItem.description }} />
                            </div>
                        )}

                        {/* Attunement Requirements */}
                        {renderAttunementRequirements()}

                        {/* Charge System */}
                        {renderChargeSystem()}

                        {/* Spell Casting */}
                        {renderSpellCasting()}

                        {/* Damage */}
                        {renderDamage()}

                        {/* Saving Throws */}
                        {renderSavingThrows()}

                        {/* Bonuses */}
                        {renderBonuses()}

                        {/* Advantage/Disadvantage */}
                        {renderAdvantageDisadvantage()}

                        {/* Conditions */}
                        {renderConditions()}

                        {/* Resistances/Immunities */}
                        {renderResistancesImmunities()}

                        {/* Curse */}
                        {renderCurse()}

                        {/* Sentience */}
                        {renderSentience()}

                        {/* Item Slot */}
                        {renderItemSlot()}

                        {/* Usage Limit */}
                        {renderUsageLimit()}

                        {/* Duration */}
                        {renderDuration()}

                        {/* Action Types */}
                        {renderActionTypes()}

                        {/* Properties */}
                        {renderProperties()}
                    </div>
                </div>
            )}
        </div>
    );
}

export default MagicItem2024;