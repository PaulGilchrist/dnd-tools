import { useState, useEffect } from 'react';
import { renderHtmlContent } from '../../utils/htmlUtils';

/**
 * Common MagicItemCard component - Displays magic item details
 * Works with normalized magic item data from both 5e and 2024 versions
 * @param {object} magicItem - The normalized magic item data object
 * @param {boolean} expand - Whether the card should be initially expanded
 * @param {function} onExpand - Callback when expand/collapse is toggled
 * @param {function} onBookmarkChange - Callback when bookmark status changes
 * @param {object} sectionRenderers - Optional 2024-specific section renderers
 */
function MagicItemCard({ magicItem, expand, onExpand, onBookmarkChange, sectionRenderers }) {
    const [isExpanded, setIsExpanded] = useState(expand);

      // Update local state when prop changes
    useEffect(() => {
        if (expand !== isExpanded) {
            setIsExpanded(expand);
           }
       }, [expand, isExpanded]);

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
                                   <div dangerouslySetInnerHTML={renderHtmlContent(magicItem.description)} />
                               </div>
                           )}

                           {/* Subtype for 5e */}
                           {magicItem.subtype && (
                               <div>
                                   <b>Subtype:</b>&nbsp;{magicItem.subtype}<br />
                               </div>
                           )}

                           {/* 2024-specific section renderers */}
                           {sectionRenderers && (
                               <>
                                   {sectionRenderers.AttunementRequirements && <sectionRenderers.AttunementRequirements magicItem={magicItem} />}
                                   {sectionRenderers.ChargeSystem && <sectionRenderers.ChargeSystem magicItem={magicItem} />}
                                   {sectionRenderers.SpellCasting && <sectionRenderers.SpellCasting magicItem={magicItem} />}
                                   {sectionRenderers.Damage && <sectionRenderers.Damage magicItem={magicItem} />}
                                   {sectionRenderers.SavingThrows && <sectionRenderers.SavingThrows magicItem={magicItem} />}
                                   {sectionRenderers.Bonuses && <sectionRenderers.Bonuses magicItem={magicItem} />}
                                   {sectionRenderers.AdvantageDisadvantage && <sectionRenderers.AdvantageDisadvantage magicItem={magicItem} />}
                                   {sectionRenderers.Conditions && <sectionRenderers.Conditions magicItem={magicItem} />}
                                   {sectionRenderers.ResistancesImmunities && <sectionRenderers.ResistancesImmunities magicItem={magicItem} />}
                                   {sectionRenderers.Curse && <sectionRenderers.Curse magicItem={magicItem} />}
                                   {sectionRenderers.Sentience && <sectionRenderers.Sentience magicItem={magicItem} />}
                                   {sectionRenderers.ItemSlot && <sectionRenderers.ItemSlot magicItem={magicItem} />}
                                   {sectionRenderers.UsageLimit && <sectionRenderers.UsageLimit magicItem={magicItem} />}
                                   {sectionRenderers.Duration && <sectionRenderers.Duration magicItem={magicItem} />}
                                   {sectionRenderers.ActionTypes && <sectionRenderers.ActionTypes magicItem={magicItem} />}
                                   {sectionRenderers.Properties && <sectionRenderers.Properties magicItem={magicItem} />}
                               </>
                           )}
                       </div>
                   </div>
               )}
           </div>
       );
}

export default MagicItemCard;