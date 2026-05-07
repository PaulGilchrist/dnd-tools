import { useState, useEffect } from 'react';
import { renderHtmlContent } from '../../utils/htmlUtils';
import MonsterStats from './MonsterStats';
import MonsterAbilityScores from './MonsterAbilityScores';
import MonsterDefenses from './MonsterDefenses';
import MonsterActions from './MonsterActions';
import MonsterReactions from './MonsterReactions';
import MonsterLegendaryActions from './MonsterLegendaryActions';
import MonsterRegionalEffects from './MonsterRegionalEffects';
import './Cover.css';

// Import all monster images dynamically
const monsterImages = import.meta.glob('../../assets/monsters/*.jpg', { eager: true });

/**
 * Common Monster component that works with normalized monster data
 * @param {object} props
 * @param {string} props.cardType - 'outer' or 'inner' card type
 * @param {boolean} props.expand - Whether the card should be initially expanded
 * @param {object} props.monster - The normalized monster data object
 * @param {function} props.onExpand - Callback when expand/collapse is toggled
 * @param {function} props.onBookmarkChange - Callback when bookmark status changes
 * @param {string} props.version - '5e' or '2024' to determine which renderers to use
 */
function MonsterCard({ cardType = 'outer', expand, monster, onExpand, onBookmarkChange }) {
    const [isExpanded, setIsExpanded] = useState(expand);
    const [imageActive, setImageActive] = useState(false);
    const [monsterImage, setMonsterImage] = useState('');

     // Update local state when prop changes
    useEffect(() => {
        if (expand !== isExpanded) {
            setIsExpanded(expand);
         }
     }, [expand, isExpanded]);

    const toggleDetails = (e) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
        onExpand(!isExpanded);
     };

    const handleCheckboxChange = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        if (monster) {
            monster.bookmarked = e.target.checked;
            onBookmarkChange(monster.index, monster.bookmarked);
         }
     };

    const handleLabelClick = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
     };

    if (!monster) {
        return null;
     }

     // Handle image modal
    const handleImageClick = (e) => {
        e.stopPropagation();
        if (monster && monster.image) {
            const imagePath = `../../assets/monsters/${monster.index}.jpg`;
            const imageModule = monsterImages[imagePath];
            setMonsterImage(imageModule ? imageModule.default : '');
            setImageActive(true);
         }
     };

    return (
         <>
             {imageActive && (
                 <div className="cover-overlay" onClick={() => setImageActive(false)}>
                     {monsterImage && (
                         <img src={monsterImage} alt={monster.name} />
                     )}
                 </div>
             )}
             <div className={`card w-100 ${isExpanded ? 'active' : ''} ${cardType === 'inner' ? 'inner' : ''}`} id={monster.index}>
                 <div className="card-header clickable">
                     <div onClick={toggleDetails}>
                         <div className="card-title">{monster.name}</div>
                         <i>
                             {monster.size} {monster.type.toLowerCase()}
                             {monster.subtype && monster.subtype !== monster.type && (
                                 <span> ({monster.subtype})</span>
                             )}, {monster.alignment}
                         </i><br />
                     </div>
                     {cardType !== 'inner' && (
                         <div className="form-check">
                             <input
                                className="form-check-input"
                                type="checkbox"
                                id={`bookmarked-${monster.index}`}
                                checked={monster.bookmarked || false}
                                onChange={handleCheckboxChange}
                             />
                             <label
                                className="form-check-label"
                                htmlFor={`bookmarked-${monster.index}`}
                                onClick={handleLabelClick}
                             >
                                Bookmarked
                             </label>
                         </div>
                     )}
                 </div>

                 {isExpanded && (
                     <div className="card-body">
                         <div className="card-text">
                             <MonsterStats monster={monster} handleImageClick={handleImageClick} />
                             <hr />
                             <MonsterAbilityScores monster={monster} />
                             <hr />
                             <MonsterDefenses monster={monster} />
                             <hr />
                             {monster.traits && monster.traits.length > 0 && (
                                 <>
                                     <MonsterActions monster={monster} sectionType="traits" />
                                     <hr />
                                 </>
                             )}
                             <div>
                                 <h5>Actions</h5>
                             </div>
                             <MonsterActions monster={monster} sectionType="actions" />
                             {monster.reactions && monster.reactions.length > 0 && (
                                 <div>
                                     <hr />
                                     <div>
                                         <h5>Reactions</h5>
                                     </div>
                                     <MonsterReactions monster={monster} />
                                 </div>
                             )}
                             {monster.legendaryActions && monster.legendaryActions.length > 0 && (
                                 <div>
                                     <hr />
                                     <div>
                                         <h5>Legendary Actions</h5>
                                     </div>
                                     <MonsterLegendaryActions monster={monster} />
                                 </div>
                             )}
                             {monster.lairActions && monster.lairActions.actions && monster.lairActions.actions.length > 0 && (
                                 <div>
                                     <hr />
                                     <div>
                                         <h5>Lair Actions</h5>
                                     </div>
                                     <div>
                                         {monster.lairActions.summary && (
                                             <span dangerouslySetInnerHTML={renderHtmlContent(monster.lairActions.summary)} />
                                         )}
                                         <br />
                                         <ul>
                                              {monster.lairActions.actions.map((action) => (
                                                  <li key={action}>
                                                      <span dangerouslySetInnerHTML={renderHtmlContent(action)} />
                                                  </li>
                                              ))}
                                         </ul>
                                         {monster.lairActions.usage && (
                                             <div>
                                                 <span dangerouslySetInnerHTML={renderHtmlContent(monster.lairActions.usage)} />
                                                 <br />
                                             </div>
                                         )}
                                     </div>
                                 </div>
                             )}
                             {monster.regionalEffects && (
                                 <div>
                                     <hr />
                                     <MonsterRegionalEffects monster={monster} />
                                 </div>
                             )}
                             {monster.desc && (
                                                               <div>
                                                                   <hr />
                                                                   <h5>Description</h5>
                                                                   <div dangerouslySetInnerHTML={renderHtmlContent(monster.desc)} />
                                                                   <br/>
                                                                   {monster.page && (
                                                                       <div>{monster.book} (page {monster.page})</div>
                                                                   )}
                                                               </div>
                                                           )}
                         </div>
                     </div>
                 )}
             </div>
         </>
     );
}

export default MonsterCard;