import { useState, useEffect } from 'react';
import './Spell.css';

function Spell({ spell, expand, onExpand, onKnownChange, onPreparedChange }) {
    const [isExpanded, setIsExpanded] = useState(expand);

    // Update local state when prop changes
    useEffect(() => {
        if (expand !== isExpanded) {
            setIsExpanded(expand);
        }
    }, [expand]);

    const getClasses = () => {
        if (!spell.classes || spell.classes.length === 0) {
            return '';
        }
        let classes = '';
        spell.classes.forEach((spellClass) => {
            classes += `${spellClass}, `;
        });
        return classes.substring(0, classes.length - 2);
    };

    const getLevelText = (level) => {
        switch (level) {
            case 0:
                return 'Cantrip';
            case 1:
                return '1st-level';
            case 2:
                return '2nd-level';
            case 3:
                return '3rd-level';
            default:
                return level + 'th-level';
        }
    };

    const toggleDetails = () => {
        setIsExpanded(!isExpanded);
        onExpand(!isExpanded);
    };

    const toggleKnown = () => {
        spell.known = !spell.known;
        
        // A spell must be known to be prepared
        if (spell.known === false && spell.prepared === true) {
            spell.prepared = false;
            onPreparedChange(spell.index, false);
        }
        
        onKnownChange(spell.index, spell.known);
    };

    const togglePrepared = () => {
        spell.prepared = !spell.prepared;
        onPreparedChange(spell.index, spell.prepared);
    };

    if (!spell) {
        return null;
    }

    // Handle HTML sanitization (simplified - in production use DOMPurify or similar)
    const sanitizeHtml = (htmlString) => {
        if (!htmlString) return '';
        // Simple approach: just return the string
        // In production, use DOMPurify: https://www.npmjs.com/package/dompurify
        return htmlString;
    };

    const renderDescription = () => {
        if (!spell.desc || spell.desc.length === 0) {
            return null;
        }

        return spell.desc.map((desc, index) => (
            <div key={index}>
                <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(desc) }} />
            </div>
        ));
    };

    const renderComponents = () => {
        if (!spell.components || spell.components.length === 0) {
            return null;
        }
        
        const componentMap = {
            'V': 'Verbal',
            'S': 'Somatic',
            'M': 'Material'
        };
        
        return spell.components.map((component, index) => (
            <span key={index} className="component-badge">
                {componentMap[component] || component}
            </span>
        ));
    };

    const renderDamage = () => {
        if (!spell.damage) {
            return null;
        }

        const damageType = spell.damage.damage_type;
        const damageText = spell.damage.damage_at_slot_level
            ? Object.entries(spell.damage.damage_at_slot_level)
                .map(([level, damage]) => `At Higher Levels: ${damage} (level ${level})`)
                .join('<br>')
            : null;

        return (
            <div>
                <b>Damage Type:</b>&nbsp;{damageType}<br />
                {damageText && (
                    <div dangerouslySetInnerHTML={{ __html: damageText }} />
                )}
            </div>
        );
    };

    const renderSavingThrow = () => {
        if (!spell.saving_throw) {
            return null;
        }

        const savingThrow = spell.saving_throw;
        return (
            <div>
                <b>Saving Throw:</b>&nbsp;{savingThrow.type}<br />
                {savingThrow.success && (
                    <div><b>Success:</b>&nbsp;{savingThrow.success}</div>
                )}
                {savingThrow.failure && (
                    <div><b>Failure:</b>&nbsp;{savingThrow.failure}</div>
                )}
            </div>
        );
    };

    const renderAreaOfEffect = () => {
        if (!spell.area_of_effect) {
            return null;
        }

        const aoe = spell.area_of_effect;
        return (
            <div>
                <b>Area of Effect:</b>&nbsp;{aoe.size} foot {aoe.type}<br />
            </div>
        );
    };

    const renderSubclasses = () => {
        if (!spell.subclasses || spell.subclasses.length === 0) {
            return null;
        }

        return (
            <div>
                <b>Subclasses:</b>&nbsp;{spell.subclasses.join(', ')}<br />
            </div>
        );
    };

    const renderStatusEffects = () => {
        if (!spell.status_effects || spell.status_effects.length === 0) {
            return null;
        }

        return (
            <div>
                <b>Status Effects:</b>&nbsp;{spell.status_effects.join(', ')}<br />
            </div>
        );
    };

    const renderCantripScaling = () => {
        if (spell.level !== 0 || !spell.cantrip_scaling) {
            return null;
        }

        const scaling = spell.cantrip_scaling;
        return (
            <div>
                <b>Cantrip Scaling:</b>&nbsp;
                {scaling.description}
            </div>
        );
    };

    return (
        <div className={`spells-2024 card w-100 ${isExpanded ? 'active' : ''}`} id={spell.index}>
            <div className="spells-2024 card-header clickable">
                <div onClick={toggleDetails}>
                    <div className="card-title">{spell.name}</div>
                    <i>{getLevelText(spell.level)}&nbsp;{spell.school && spell.school.toLowerCase()}</i>
                    {spell.ritual && (
                        <span>(ritual)</span>
                    )}<br />
                </div>
                <div>
                    <div className="form-check">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="prepared" 
                            name="prepared"
                            disabled={spell.known !== true}
                            checked={spell.prepared || false}
                            onChange={togglePrepared}
                        />
                        <label className="form-check-label" htmlFor="prepared">
                            Prepared
                        </label>
                    </div>
                    <div className="form-check">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="known" 
                            name="known"
                            checked={spell.known || false}
                            onChange={toggleKnown}
                        />
                        <label className="form-check-label" htmlFor="known">
                            Known
                        </label>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="spells-2024 card-body">
                    <div className="card-text">
                        <div className="stats">
                            <div>
                                <b>Casting Time:</b>&nbsp;{spell.casting_time}<br />
                                <b>Range:</b>&nbsp;{spell.range}<br />
                                <b>Components:</b>&nbsp;{renderComponents()}
                                {spell.material && (
                                    <div><b>Material:</b>&nbsp;{spell.material}</div>
                                )}<br />
                                <b>Duration:</b>&nbsp;{spell.concentration && (
                                    <span className="concentration-badge">Concentration,&nbsp;</span>
                                )}{spell.duration}<br />
                            </div>
                            <div>
                                <b>Classes:</b>&nbsp;{getClasses()}<br />
                                {renderSubclasses()}
                                {renderAreaOfEffect()}
                                {renderDamage()}
                                {renderSavingThrow()}
                                {renderStatusEffects()}
                                {renderCantripScaling()}
                            </div>
                        </div>

                        <hr />

                        {renderDescription()}

                        {spell.higher_level && spell.higher_level.length > 0 && (
                            <div>
                                <br /><b>At higher levels.</b>&nbsp;
                                {spell.higher_level.map((levelText, index) => (
                                    <div key={index}>{levelText}</div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Spell;