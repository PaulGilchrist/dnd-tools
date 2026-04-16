import MagicItem2024 from './MagicItem2024';

function MagicItems2024List({ filteredItems, showMagicItem, shownCard, expandCard, handleBookmarkChange }) {
    return (
        <div className="list">
            {filteredItems.map((magicItem) => (
                <div key={magicItem.index} id={magicItem.index} data-item-index={magicItem.index}>
                    {showMagicItem(magicItem) && (
                        <MagicItem2024 
                            magicItem={magicItem}
                            expand={shownCard === magicItem.index}
                            onExpand={(expanded) => expandCard(magicItem.index, expanded)}
                            onBookmarkChange={handleBookmarkChange}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

export default MagicItems2024List;