import SpellCard from '../../common/SpellCard';
import { normalizeSpell2024 } from '../../adapters/spellAdapters';

/**
 * 2024 Spell component - Wraps common SpellCard with 2024 adapter
 * @param {object} spell - The 2024 spell data object
 * @param {boolean} expand - Whether the card should be initially expanded
 * @param {function} onExpand - Callback when expand/collapse is toggled
 * @param {function} onKnownChange - Callback when known status changes
 * @param {function} onPreparedChange - Callback when prepared status changes
 */
function Spell({ spell, expand, onExpand, onKnownChange, onPreparedChange }) {
    if (!spell) {
        return null;
    }

         // Normalize the 2024 spell data for the common component
    const normalizedSpell = normalizeSpell2024(spell);

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