import { useState, useEffect } from 'react';
import './Monster.css';
import MonsterAbilityScores from './MonsterAbilityScores';
import MonsterStats from './MonsterStats';
import MonsterDefenses from './MonsterDefenses';
import MonsterSpecialAbilities from './MonsterSpecialAbilities';
import MonsterActions from './MonsterActions';
import MonsterReactions from './MonsterReactions';
import MonsterLegendaryActions from './MonsterLegendaryActions';
import MonsterLairActions from './MonsterLairActions';
import MonsterRegionalEffects from './MonsterRegionalEffects';

// Import all monster images dynamically
const monsterImages = import.meta.glob('../../assets/monsters/*.jpg', { eager: true });

function Monster({ cardType = 'outer', expand, monster, onExpand, onBookmarkChange }) {
    const [isExpanded, setIsExpanded] = useState(expand);
    const [imageActive, setImageActive] = useState(false);
    const [monsterImage, setMonsterImage] = useState('');

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

    // Handle image modal - similar to Locations.jsx
    const handleImageClick = (e) => {
        e.stopPropagation();
        if (monster && monster.image) {
            const imagePath = `../assets/monsters/${monster.index}.jpg`;
            setMonsterImage(monsterImages[imagePath]?.default || '');
            setImageActive(true);
        }
    };

    return (
        <>
            {imageActive && (
                <div className="cover" onClick={() => setImageActive(false)}>
                    <img src={monsterImage} alt={monster.name} />
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
                            <MonsterSpecialAbilities monster={monster} />
                            <hr />
                            <div className="removeExtraLine">
                                <h5>Actions</h5>
                            </div>
                            <MonsterActions monster={monster} />
                            {monster.reactions && (
                                <div>
                                    <hr />
                                    <div className="removeExtraLine">
                                        <h5>Reactions</h5>
                                    </div>
                                    <MonsterReactions monster={monster} />
                                </div>
                            )}
                            {monster.legendary_actions && (
                                <div>
                                    <hr />
                                    <div className="removeExtraLine">
                                        <h5>Legendary Actions</h5>
                                    </div>
                                    <MonsterLegendaryActions monster={monster} />
                                </div>
                            )}
                            {monster.lair_actions && (
                                <div>
                                    <hr />
                                    <MonsterLairActions monster={monster} />
                                </div>
                            )}
                            {monster.regional_effects && (
                                <div>
                                    <hr />
                                    <MonsterRegionalEffects monster={monster} />
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

export default Monster;

