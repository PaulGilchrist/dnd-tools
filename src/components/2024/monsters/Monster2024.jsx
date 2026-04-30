import MonsterCard from '../../common/MonsterCard';
import { normalizeMonster2024 } from '../../adapters/monsterAdapters';

/**
 * Monster2024 component - Wraps common MonsterCard with 2024 adapter
 * @param {string} cardType - 'outer' or 'inner' card type
 * @param {boolean} expand - Whether the card should be initially expanded
 * @param {object} monster - The 2024 monster data object
 * @param {function} onExpand - Callback when expand/collapse is toggled
 * @param {function} onBookmarkChange - Callback when bookmark status changes
 */
function Monster2024({ cardType = 'outer', expand, monster, onExpand, onBookmarkChange }) {
    if (!monster) {
        return null;
    }

        // Normalize the 2024 monster data for the common component
    const normalizedMonster = normalizeMonster2024(monster);

    return (
            <MonsterCard
               cardType={cardType}
               expand={expand}
               monster={normalizedMonster}
               onExpand={onExpand}
               onBookmarkChange={onBookmarkChange}
               version="2024"
            />
        );
}

export default Monster2024;