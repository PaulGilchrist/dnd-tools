import { useState, useEffect } from 'react';
import SpellDetails from './SpellDetails';
import { getClasses, getLevelText } from '../../utils/spellUtils';

/**
 * SpellCard component - Displays spell details
 * Works with normalized spell data from both 5e and 2024 versions
 * @param {object} spell - The normalized spell data object
 * @param {boolean} expand - Whether the card should be initially expanded
 * @param {function} onExpand - Callback when expand/collapse is toggled
 * @param {function} onKnownChange - Callback when known status changes
 * @param {function} onPreparedChange - Callback when prepared status changes
 */
function SpellCard({ spell, expand, onExpand, onKnownChange, onPreparedChange }) {
    const [isExpanded, setIsExpanded] = useState(expand);

    useEffect(() => {
        if (expand !== isExpanded) {
            setIsExpanded(expand);
        }
    }, [expand, isExpanded]);

    const toggleDetails = () => {
        setIsExpanded(!isExpanded);
        onExpand(!isExpanded);
    };

    const toggleKnown = () => {
        spell.known = !spell.known;
        
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

    return (
        <div className={`card w-100 ${isExpanded ? 'active' : ''}`} id={spell.index}>
            <div className="card-header clickable" onClick={toggleDetails}>
                <div>
                    <div className="card-title">{spell.name}</div>
                    <i>{getLevelText(spell.level)}&nbsp;{spell.school && spell.school.toLowerCase()}</i>
                    {spell.ritual && (
                        <span> (ritual)</span>
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
                <SpellDetails spell={spell} />
            )}
        </div>
    );
}

export default SpellCard;
