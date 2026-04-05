import MagicItem from './MagicItem';

function MagicItemList({ filteredItems, showMagicItem, shownCard, expandCard, handleBookmarkChange }) {
    return (
        <div className="list">
            {filteredItems.map((magicItem) => (
                <div key={magicItem.index} id={magicItem.index}>
                    {showMagicItem(magicItem) && (
                        <MagicItem 
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

export default MagicItemList;
