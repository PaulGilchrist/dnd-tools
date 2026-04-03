import { useState, useEffect } from 'react';
import './Monster.css';

// Import all monster images dynamically
const monsterImages = import.meta.glob('../assets/monsters/*.jpg', { eager: true });

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

    const getAbilityModifier = (abilityScore) => {
        return Math.floor((abilityScore - 10) / 2);
    };

    const getNameString = (names) => {
        if (!names || names.length === 0) return '';
        let nameString = '';
        names.forEach((name) => {
            nameString += `${name}, `;
        });
        return nameString.substring(0, nameString.length - 2);
    };

    const getSavingThrows = () => {
        if (!monster || !monster.proficiencies) return '';
        let savingThrows = '';
        monster.proficiencies.forEach((proficiency) => {
            if (proficiency.name.startsWith('Saving Throw:')) {
                savingThrows += `${proficiency.name.substring(14, 17)} +${proficiency.value}, `;
            }
        });
        return savingThrows.substring(0, savingThrows.length - 2);
    };

    const getSenses = () => {
        if (!monster || !monster.senses) return '';
        let senses = '';
        if (monster.senses.blindsight) {
            senses += `blindsight ${monster.senses.blindsight}, `;
        }
        if (monster.senses.darkvision) {
            senses += `darkvision ${monster.senses.darkvision}, `;
        }
        if (monster.senses.passive_perception) {
            senses += `passive perception ${monster.senses.passive_perception}, `;
        }
        if (monster.senses.tremorsense) {
            senses += `tremorsense ${monster.senses.tremorsense}, `;
        }
        if (monster.senses.truesight) {
            senses += `truesight ${monster.senses.truesight}, `;
        }
        return senses.substring(0, senses.length - 2);
    };

    const getSkills = () => {
        if (!monster || !monster.proficiencies) return '';
        let skills = '';
        monster.proficiencies.forEach((proficiency) => {
            if (proficiency.name.startsWith('Skill:')) {
                skills += `${proficiency.name.substring(7)} +${proficiency.value}, `;
            }
        });
        return skills.substring(0, skills.length - 2);
    };

    const hasSavingThrows = () => {
        if (!monster || !monster.proficiencies) return false;
        let hasSavingThrows = false;
        monster.proficiencies.forEach((proficiency) => {
            if (proficiency.name.startsWith('Saving Throw:')) {
                hasSavingThrows = true;
            }
        });
        return hasSavingThrows;
    };

    const hasSkills = () => {
        if (!monster || !monster.proficiencies) return false;
        let hasSkills = false;
        monster.proficiencies.forEach((proficiency) => {
            if (proficiency.name.startsWith('Skill:')) {
                hasSkills = true;
            }
        });
        return hasSkills;
    };

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
                            <div className="stats">
                                <div>
                                    <b>Armor Class:</b>&nbsp;{monster.armor_class}<br />
                                    <b>Hit Points:</b>&nbsp;{monster.hit_points}&nbsp;({monster.hit_dice})<br />
                                    <b>Speed:</b>&nbsp;{monster.speed?.walk ? monster.speed.walk : '0 ft.'}
                                    {monster.speed?.burrow && (
                                        <span>, burrow {monster.speed.burrow}</span>
                                    )}
                                    {monster.speed?.climb && (
                                        <span>, climb {monster.speed.climb}</span>
                                    )}
                                    {monster.speed?.fly && (
                                        <span>, fly {monster.speed.fly}</span>
                                    )}
                                    {monster.speed?.hover && (
                                        <span> (hover)</span>
                                    )}
                                    {monster.speed?.swim && (
                                        <span>, swim {monster.speed.swim}</span>
                                    )}<br />
                                </div>
                                <div>
                                    {monster.image && (
                                        <button 
                                            type="button" 
                                            className="btn btn-primary" 
                                            onClick={handleImageClick}
                                        >
                                            Image
                                        </button>
                                    )}
                                </div>
                            </div>
                            <hr />
                            <div className="abilities">
                                <div className="ability">
                                    <div className="ability-name">STR</div>
                                    <div>{monster.strength} ({getAbilityModifier(monster.strength)})</div>
                                </div>
                                <div className="ability">
                                    <div className="ability-name">DEX</div>
                                    <div>{monster.dexterity} ({getAbilityModifier(monster.dexterity)})</div>
                                </div>
                                <div className="ability">
                                    <div className="ability-name">CON</div>
                                    <div>{monster.constitution} ({getAbilityModifier(monster.constitution)})</div>
                                </div>
                                <div className="ability">
                                    <div className="ability-name">INT</div>
                                    <div>{monster.intelligence} ({getAbilityModifier(monster.intelligence)})</div>
                                </div>
                                <div className="ability">
                                    <div className="ability-name">WIS</div>
                                    <div>{monster.wisdom} ({getAbilityModifier(monster.wisdom)})</div>
                                </div>
                                <div className="ability">
                                    <div className="ability-name">CHA</div>
                                    <div>{monster.charisma} ({getAbilityModifier(monster.charisma)})</div>
                                </div>
                            </div>
                            <hr />
                            {hasSavingThrows() && (
                                <div>
                                    <b>Saving Throws:</b>&nbsp;{getSavingThrows()}<br />
                                </div>
                            )}
                            {hasSkills() && (
                                <div>
                                    <b>Skills:</b>&nbsp;{getSkills()}<br />
                                </div>
                            )}
                            {monster.condition_immunities && monster.condition_immunities.length > 0 && (
                                <div>
                                    <b>Condition Immunities:</b>&nbsp;{getNameString(monster.condition_immunities)}<br />
                                </div>
                            )}
                            {monster.damage_immunities && monster.damage_immunities.length > 0 && (
                                <div>
                                    <b>Damage Immunities:</b>&nbsp;{getNameString(monster.damage_immunities)}<br />
                                </div>
                            )}
                            {monster.damage_resistances && monster.damage_resistances.length > 0 && (
                                <div>
                                    <b>Damage Resistances:</b>&nbsp;{getNameString(monster.damage_resistances)}<br />
                                </div>
                            )}
                            {monster.damage_vulnerabilities && monster.damage_vulnerabilities.length > 0 && (
                                <div>
                                    <b>Damage Vulnerabilities:</b>&nbsp;{getNameString(monster.damage_vulnerabilities)}<br />
                                </div>
                            )}
                            <b>Senses:</b>&nbsp;{getSenses()}<br />
                            {monster.languages && (
                                <div>
                                    <b>Languages:</b>&nbsp;{monster.languages}<br />
                                </div>
                            )}
                            {monster.environments && monster.environments.length > 0 && (
                                <div>
                                    <b>Environments:</b>&nbsp;{getNameString(monster.environments)}<br />
                                </div>
                            )}
                            {monster.allies && monster.allies.length > 0 && (
                                <div>
                                    <b>Allies:</b>&nbsp;{getNameString(monster.allies)}<br />
                                </div>
                            )}
                            {monster.enemies && monster.enemies.length > 0 && (
                                <div>
                                    <b>Enemies:</b>&nbsp;{getNameString(monster.enemies)}<br />
                                </div>
                            )}
                            <b>Challenge:</b>&nbsp;{monster.challenge_rating}&nbsp;({monster.xp} XP)<br />
                            <hr />
                            <div className="removeExtraLine">
                                {monster.special_abilities && monster.special_abilities.map((special_ability, index) => (
                                    <span key={index}>
                                        <b>
                                            {special_ability.name}
                                            {special_ability.usage && special_ability.usage.type === 'per day' && (
                                                <span>&nbsp;({special_ability.usage.times}/day)</span>
                                            )}:
                                        </b>&nbsp;{special_ability.desc}<br /><br />
                                    </span>
                                ))}
                            </div>
                            <hr />
                            <div className="removeExtraLine">
                                <h5>Actions</h5>
                                {monster.actions && monster.actions.map((action, index) => (
                                    <div key={index}>
                                        <b>
                                            {action.name}
                                            {action.usage && action.usage.type === 'recharge on roll' && (
                                                <span>&nbsp;(Recharge {action.usage.min_value}-6)</span>
                                            )}
                                            {action.usage && action.usage.type === 'per day' && (
                                                <span>&nbsp;({action.usage.times}/Day)</span>
                                            )}:
                                        </b>&nbsp;{action.desc}<br /><br />
                                    </div>
                                ))}
                            </div>
                            {monster.reactions && (
                                <div>
                                    <hr />
                                    <div className="removeExtraLine">
                                        <h5>Reactions</h5>
                                        {monster.reactions.map((reaction, index) => (
                                            <span key={index}>
                                                <b>{reaction.name}:</b>&nbsp;{reaction.desc}<br /><br />
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {monster.legendary_actions && (
                                <div>
                                    <hr />
                                    <div className="removeExtraLine">
                                        <h5>Legendary Actions</h5>
                                        {monster.legendary_actions.map((legendary_action, index) => (
                                            <span key={index}>
                                                <b>{legendary_action.name}:</b>&nbsp;{legendary_action.desc}<br /><br />
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {monster.lair_actions && (
                                <div>
                                    <hr />
                                    <h5>Lair Actions</h5>
                                    {monster.lair_actions.summary}<br />
                                    <ul>
                                        {monster.lair_actions.actions.map((action, index) => (
                                            <li key={index}>{action}</li>
                                        ))}
                                    </ul>
                                    {monster.lair_actions.usage && (
                                        <div>{monster.lair_actions.usage}<br /></div>
                                    )}
                                </div>
                            )}
                            {monster.regional_effects && (
                                <div>
                                    <hr />
                                    <h5>Regional Effects</h5>
                                    {monster.regional_effects.summary}<br />
                                    <ul>
                                        {monster.regional_effects.effects.map((effect, index) => (
                                            <li key={index}>{effect}</li>
                                        ))}
                                    </ul>
                                    {monster.regional_effects.usage}<br />
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
