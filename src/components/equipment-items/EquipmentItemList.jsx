import EquipmentItem from './EquipmentItem';

function EquipmentItemList({ filteredItems, showEquipmentItem, shownCard, expandCard, handleBookmarkChange }) {
    return (
        <div className="list">
            {filteredItems.map((equipmentItem) => (
                <div key={equipmentItem.index} id={equipmentItem.index}>
                    {showEquipmentItem(equipmentItem) && (
                        <EquipmentItem 
                            equipmentItem={equipmentItem}
                            expand={shownCard === equipmentItem.index}
                            onExpand={(expanded) => expandCard(equipmentItem.index, expanded)}
                            onBookmarkChange={handleBookmarkChange}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

export default EquipmentItemList;
