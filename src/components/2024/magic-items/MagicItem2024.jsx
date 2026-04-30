import { useState, useEffect } from 'react';
import {
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
} from './MagicItemSections';

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
                         <AttunementRequirements magicItem={magicItem} />

                        {/* Charge System */}
                         <ChargeSystem magicItem={magicItem} />
                         {/* Spell Casting */}
                         <SpellCasting magicItem={magicItem} />

                         {/* Damage */}
                         <Damage magicItem={magicItem} />
                         {/* Saving Throws */}
                         <SavingThrows magicItem={magicItem} />

                         {/* Bonuses */}
                         <Bonuses magicItem={magicItem} />

                         {/* Advantage/Disadvantage */}
                         <AdvantageDisadvantage magicItem={magicItem} />
                         {/* Conditions */}
                         <Conditions magicItem={magicItem} />

                         {/* Resistances/Immunities */}
                         <ResistancesImmunities magicItem={magicItem} />
                         {/* Curse */}
                         <Curse magicItem={magicItem} />

                         {/* Sentience */}
                         <Sentience magicItem={magicItem} />
                         {/* Item Slot */}
                         <ItemSlot magicItem={magicItem} />
                         {/* Usage Limit */}
                         <UsageLimit magicItem={magicItem} />

                         {/* Duration */}
                         <Duration magicItem={magicItem} />
                         {/* Action Types */}
                         <ActionTypes magicItem={magicItem} />
                         {/* Properties */}
                         <Properties magicItem={magicItem} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default MagicItem2024;