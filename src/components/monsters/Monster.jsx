import MonsterCard from '../common/MonsterCard';
import { normalizeMonster5e } from '../adapters/monsterAdapters';

/**
 * 5e Monster component - Wraps common MonsterCard with 5e adapter
 * @param {string} cardType - 'outer' or 'inner' card type
 * @param {boolean} expand - Whether the card should be initially expanded
 * @param {object} monster - The 5e monster data object
 * @param {function} onExpand - Callback when expand/collapse is toggled
 * @param {function} onBookmarkChange - Callback when bookmark status changes
 */
function Monster({ cardType = 'outer', expand, monster, onExpand, onBookmarkChange }) {
    if (!monster) {
        return null;
    }

      // Normalize the 5e monster data for the common component
    const normalizedMonster = normalizeMonster5e(monster);

    return (
           <MonsterCard
               cardType={cardType}
               expand={expand}
               monster={normalizedMonster}
               onExpand={onExpand}
               onBookmarkChange={onBookmarkChange}
               version="5e"
           />
       );
}

export default Monster;
