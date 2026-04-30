import SpellCard from '../common/SpellCard';
import { normalizeSpell5e } from '../adapters/spellAdapters';

/**
 * 5e Spell component - Wraps common SpellCard with 5e adapter
 * @param {object} spell - The 5e spell data object
 * @param {boolean} expand - Whether the card should be initially expanded
 * @param {function} onExpand - Callback when expand/collapse is toggled
 * @param {function} onKnownChange - Callback when known status changes
 * @param {function} onPreparedChange - Callback when prepared status changes
 */
function Spell({ spell, expand, onExpand, onKnownChange, onPreparedChange }) {
    if (!spell) {
        return null;
        }

       // Normalize the 5e spell data for the common component
    const normalizedSpell = normalizeSpell5e(spell);

    return (
            <SpellCard
               spell={normalizedSpell}
               expand={expand}
               onExpand={onExpand}
               onKnownChange={onKnownChange}
               onPreparedChange={onPreparedChange}
            />
        );
}

export default Spell;
