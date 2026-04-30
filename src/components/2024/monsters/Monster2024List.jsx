import MonsterCard from '../../common/MonsterCard';
import { normalizeMonster2024 } from '../../adapters/monsterAdapters';

/**
 * Monster2024List component - Displays a list of monster cards
 * @param {array} monsters - Array of 2024 monster data objects
 * @param {string} shownCard - Index of the currently shown/expanded card
 * @param {function} expandCard - Callback to expand/collapse a card
 * @param {function} handleBookmarkChange - Callback when bookmark status changes
 */
function Monster2024List({ monsters, shownCard, expandCard, handleBookmarkChange }) {
    return (
              <div className="list">
                  {monsters.map((monster) => {
                    const normalizedMonster = normalizeMonster2024(monster);
                    return (
                          <div key={monster.index} id={monster.index}>
                              <MonsterCard
                                monster={normalizedMonster}
                                expand={shownCard === monster.index}
                                onExpand={(expanded) => expandCard(monster.index, expanded)}
                                onBookmarkChange={handleBookmarkChange}
                                version="2024"
                              />
                          </div>
                      );
                  })}
              </div>
          );
}

export default Monster2024List;