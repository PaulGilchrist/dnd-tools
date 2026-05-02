import MonsterCard from '../common/MonsterCard';
import { normalizeMonster5e } from '../adapters/monsterAdapters';

/**
 * 5e MonsterList component - Displays a list of monster cards
 * @param {array} monsters - Array of 5e monster data objects
 * @param {string} shownCard - Index of the currently shown/expanded card
 * @param {function} expandCard - Callback to expand/collapse a card
 * @param {function} handleBookmarkChange - Callback when bookmark status changes
 */
function MonsterList({ monsters, shownCard, expandCard, handleBookmarkChange }) {
    if (!monsters) {
        return null;
    }
    return (
            <div className="list">
                {monsters.map((monster) => {
                    const normalizedMonster = normalizeMonster5e(monster);
                    return (
                        <div key={monster.index} id={monster.index}>
                            <MonsterCard
                               monster={normalizedMonster}
                               expand={shownCard === monster.index}
                               onExpand={(expanded) => expandCard(monster.index, expanded)}
                               onBookmarkChange={handleBookmarkChange}
                               version="5e"
                            />
                        </div>
                    );
                })}
            </div>
        );
}

export default MonsterList;
