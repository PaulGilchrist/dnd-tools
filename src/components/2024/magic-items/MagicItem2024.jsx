import MagicItemCard from '../../common/MagicItemCard';
import MagicItemSections from '../../common/MagicItemSections';
import { normalizeMagicItem2024 } from '../../adapters/magicItemAdapters';

/**
 * 2024 MagicItem component - Wraps common MagicItemCard with 2024 adapter
 * @param {object} magicItem - The 2024 magic item data object
 * @param {boolean} expand - Whether the card should be initially expanded
 * @param {function} onExpand - Callback when expand/collapse is toggled
 * @param {function} onBookmarkChange - Callback when bookmark status changes
 */
function MagicItem2024({ magicItem, expand, onExpand, onBookmarkChange }) {
    if (!magicItem) {
        return null;
    }

         // Normalize the 2024 magic item data for the common component
    const normalizedMagicItem = normalizeMagicItem2024(magicItem);

    return (
              <MagicItemCard
               magicItem={normalizedMagicItem}
               expand={expand}
               onExpand={onExpand}
               onBookmarkChange={onBookmarkChange}
               sectionRenderers={MagicItemSections}
              />
          );
}

export default MagicItem2024;