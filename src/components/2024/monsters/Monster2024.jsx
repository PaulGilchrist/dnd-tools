import { useState, useEffect } from 'react';
import { renderHtmlContent } from '../../../utils/htmlUtils';
import Monster2024AbilityScores from './Monster2024AbilityScores';
import Monster2024Stats from './Monster2024Stats';
import Monster2024Defenses from './Monster2024Defenses';
import Monster2024SpecialAbilities from './Monster2024SpecialAbilities';
import Monster2024Actions from './Monster2024Actions';
import Monster2024Reactions from './Monster2024Reactions';
import Monster2024LegendaryActions from './Monster2024LegendaryActions';
import Monster2024RegionalEffects from './Monster2024RegionalEffects';
import '../../common/Cover.css';

// Get the base URL from Vite's environment variables (set by vite.config.js)
const BASE_URL = import.meta.env.BASE_URL || '';

// Import all monster images dynamically
const monsterImages = import.meta.glob('../../../assets/monsters/*.jpg', { eager: true });

/**
 * Monster2024 component - Displays a single monster card with 2024 rules data
 * @param {string} cardType - 'outer' or 'inner' card type
 * @param {boolean} expand - Whether the card should be initially expanded
 * @param {object} monster - The monster data object
 * @param {function} onExpand - Callback when expand/collapse is toggled
 * @param {function} onBookmarkChange - Callback when bookmark status changes
 */
function Monster2024({ cardType = 'outer', expand, monster, onExpand, onBookmarkChange }) {
    const [isExpanded, setIsExpanded] = useState(expand);
    const [imageActive, setImageActive] = useState(false);
    const [monsterImage, setMonsterImage] = useState('');

    // Update local state when prop changes
    useEffect(() => {
        if (expand !== isExpanded) {
            setIsExpanded(expand);
        }
    }, [expand]);

    const toggleDetails = (e) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
        onExpand(!isExpanded);
    };

    const toggleBookmark = () => {
        if (monster) {
            monster.bookmarked = !monster.bookmarked;
            onBookmarkChange(monster.index, monster.bookmarked);
        }
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
            const imagePath = `../../../assets/monsters/${monster.index}.jpg`;
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
                            <Monster2024Stats monster={monster} handleImageClick={handleImageClick} />
                            <hr />
                            <Monster2024AbilityScores monster={monster} />
                            <hr />
                            <Monster2024Defenses monster={monster} />
                            <hr />
                            {monster.traits && monster.traits.length > 0 && (
                                <>
                                    <Monster2024SpecialAbilities monster={monster} />
                                    <hr />
                                </>
                            )}
                            <div>
                                <h5>Actions</h5>
                            </div>
                            <Monster2024Actions monster={monster} />
                            {monster.reactions && monster.reactions.length > 0 && (
                                <div>
                                    <hr />
                                    <div>
                                        <h5>Reactions</h5>
                                    </div>
                                    <Monster2024Reactions monster={monster} />
                                </div>
                            )}
                            {monster.legendary_actions && monster.legendary_actions.length > 0 && (
                                <div>
                                    <hr />
                                    <div>
                                        <h5>Legendary Actions</h5>
                                    </div>
                                    <Monster2024LegendaryActions monster={monster} />
                                </div>
                            )}
                            {monster.lair_actions && monster.lair_actions.length > 0 && (
                                <div>
                                    <hr />
                                    <div>
                                        <h5>Lair Actions</h5>
                                    </div>
                                    <span dangerouslySetInnerHTML={renderHtmlContent(monster.lair_actions)} />
                                </div>
                            )}
                            {monster.regional_effects && (
                                <div>
                                    <hr />
                                    <Monster2024RegionalEffects monster={monster} />
                                </div>
                            )}
                            {monster.desc && (
                                <div>
                                    <hr />
                                    <h5>Description</h5>
                                    <div dangerouslySetInnerHTML={{ __html: monster.desc }} />
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

export default Monster2024;