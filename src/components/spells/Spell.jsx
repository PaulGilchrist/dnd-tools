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

    return (
        <div className={`card w-100 ${isExpanded ? 'active' : ''}`} id={spell.index}>
            <div className="card-header clickable">
                <div onClick={toggleDetails}>
                    <div className="card-title">{spell.name}</div>
                    <i>{getLevelText(spell.level)}&nbsp;{spell.school.toLowerCase()}</i>
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
                <div className="card-body">
                    <div className="card-text">
                        <div className="stats">
                            <div>
                                <b>Casting Time:</b>&nbsp;{spell.casting_time}<br />
                                <b>Range:</b>&nbsp;{spell.range}<br />
                                <b>Components:</b>&nbsp;{spell.components}
                                {spell.material && (
                                    <span>({spell.material})</span>
                                )}<br />
                                <b>Duration:</b>&nbsp;{spell.concentration && (
                                    <span>Concentration,&nbsp;</span>
                                )}{spell.duration}<br />
                            </div>
                            <div>
                                <b>Classes:</b>&nbsp;{getClasses()}<br />
                                {spell.area_of_effect && (
                                    <div>
                                        <b>Area of Effect:</b>&nbsp;{spell.area_of_effect.size} foot {spell.area_of_effect.type}<br />
                                    </div>
                                )}
                                {spell.damage && (
                                    <div>
                                        <b>Damage Type:</b>&nbsp;{spell.damage.damage_type}<br />
                                    </div>
                                )}
                                {spell.dc && (
                                    <div>
                                        <b>DC:</b>&nbsp;{spell.dc.dc_type} ({spell.dc.dc_success})<br />
                                    </div>
                                )}
                            </div>
                        </div>

                        <hr />

                        {renderDescription()}

                        {spell.higher_level && (
                            <div>
                                <br /><b>At higher levels.</b>&nbsp;{spell.higher_level}<br />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Spell;
