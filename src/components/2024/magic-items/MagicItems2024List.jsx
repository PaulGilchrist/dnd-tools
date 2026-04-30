import MagicItemCard from '../../common/MagicItemCard';
import MagicItemSections from '../../common/MagicItemSections';
import { normalizeMagicItem2024 } from '../../adapters/magicItemAdapters';

/**
 * 2024 MagicItemsList component - Displays a list of magic item cards
 * @param {array} filteredItems - Array of filtered magic item data objects
 * @param {function} showMagicItem - Function to determine if a magic item should be shown
 * @param {string} shownCard - Index of the currently shown/expanded card
 * @param {function} expandCard - Callback to expand/collapse a card
 * @param {function} handleBookmarkChange - Callback when bookmark status changes
 */
function MagicItems2024List({ filteredItems, showMagicItem, shownCard, expandCard, handleBookmarkChange }) {
    return (
              <div className="list">
                  {filteredItems.map((magicItem) => {
                    const normalizedMagicItem = normalizeMagicItem2024(magicItem);
                    return (
                          <div key={magicItem.index} id={magicItem.index} data-item-index={magicItem.index}>
                              {showMagicItem(magicItem) && (
                                  <MagicItemCard 
                                   magicItem={normalizedMagicItem}
                                   expand={shownCard === magicItem.index}
                                   onExpand={(expanded) => expandCard(magicItem.index, expanded)}
                                   onBookmarkChange={handleBookmarkChange}
                                   sectionRenderers={MagicItemSections}
                                  />
                              )}
                          </div>
                      );
                  })}
              </div>
          );
}

export default MagicItems2024List;