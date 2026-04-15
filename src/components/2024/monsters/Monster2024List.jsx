import Monster2024 from './Monster2024';

/**
 * Monster2024List component - Displays a list of monster cards
 * @param {array} monsters - Array of monster data objects
 * @param {string} shownCard - Index of the currently shown/expanded card
 * @param {function} expandCard - Callback to expand/collapse a card
 * @param {function} handleBookmarkChange - Callback when bookmark status changes
 */
function Monster2024List({ monsters, shownCard, expandCard, handleBookmarkChange }) {
    return (
        <div className="list">
            {monsters.map((monster) => (
                <div key={monster.index} id={monster.index}>
                    <Monster2024
                        monster={monster}
                        expand={shownCard === monster.index}
                        onExpand={(expanded) => expandCard(monster.index, expanded)}
                        onBookmarkChange={handleBookmarkChange}
                    />
                </div>
            ))}
        </div>
    );
}

export default Monster2024List;