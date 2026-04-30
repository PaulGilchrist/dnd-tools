import MagicItemCard from '../common/MagicItemCard';
import { normalizeMagicItem5e } from '../adapters/magicItemAdapters';

/**
 * 5e MagicItem component - Wraps common MagicItemCard with 5e adapter
 * @param {object} magicItem - The 5e magic item data object
 * @param {boolean} expand - Whether the card should be initially expanded
 * @param {function} onExpand - Callback when expand/collapse is toggled
 * @param {function} onBookmarkChange - Callback when bookmark status changes
 */
function MagicItem({ magicItem, expand, onExpand, onBookmarkChange }) {
    if (!magicItem) {
        return null;
    }

       // Normalize the 5e magic item data for the common component
    const normalizedMagicItem = normalizeMagicItem5e(magicItem);

    return (
            <MagicItemCard
               magicItem={normalizedMagicItem}
               expand={expand}
               onExpand={onExpand}
               onBookmarkChange={onBookmarkChange}
            />
        );
}

export default MagicItem;

