import Monster from './Monster';

function MonsterList({ monsters, shownCard, expandCard, handleBookmarkChange }) {
    return (
        <div className="list">
            {monsters.map((monster) => (
                <div key={monster.index} id={monster.index}>
                    <Monster
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

export default MonsterList;
