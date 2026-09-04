import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMagicItems } from '../../data/dataServiceHooks';
import { scrollIntoView } from '../../data/utils';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem, sanitizeFilter } from '../../utils/localStorage';
import MagicItemCard from '../common/MagicItemCard';
import MagicItemSections from '../common/MagicItemSections';
import { normalizeMagicItem2024 } from '../adapters/magicItemAdapters';
import MagicItems2024FilterForm from '../2024/magic-items/MagicItems2024FilterForm';

const defaultFilter = {
    bookmarked: 'All',
    attunement: 'All',
    name: '',
    rarity: 'All',
    type: 'All'
};

/**
 * Unified MagicItems component that works with both 5e and 2024 rule versions.
 * Uses version-aware data fetching, filter persistence, and bookmarks.
 * Conditionally renders the appropriate filter form and normalizes items
 * based on the active rule version.
 */
// eslint-disable-next-line max-lines-per-function
function MagicItems() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch the consolidated magic items list
    const { data: magicItemsData, loading: magicItemsLoading } = useMagicItems();

    // Storage keys
    const filterKey = LOCAL_STORAGE_KEYS.MAGIC_ITEMS_FILTER;
    const bookmarkedKey = LOCAL_STORAGE_KEYS.MAGIC_ITEMS_BOOKMARKED;

    // Filter state with version-aware localStorage persistence
    const [filter, setFilter] = useState(() => {
        const savedFilter = getLocalStorageItem(filterKey);
        if (savedFilter) {
            try {
                return sanitizeFilter(defaultFilter, savedFilter);
            } catch (e) {
                console.error('Error parsing saved filter:', e);
            }
        }
        return { ...defaultFilter };
    });

    // Save filter to localStorage whenever it changes
    const saveFilterToStorage = useCallback(() => {
        setLocalStorageItem(filterKey, filter);
    }, [filter, filterKey]);

    // Save filter on mount and when it changes
    useEffect(() => {
        saveFilterToStorage();
    }, [saveFilterToStorage]);

    // Bookmarked indexes state with localStorage persistence
    const [bookmarkedIndexes, setBookmarkedIndexes] = useState(() => {
        const saved = getLocalStorageItem(bookmarkedKey);
        if (saved) {
            try {
                return saved;
            } catch (e) {
                console.error('Error parsing bookmarked items:', e);
            }
        }
        return [];
    });

    const [shownCard, setShownCard] = useState('');

    // Process data: deduplicate, merge bookmarks, handle URL index param
    const processedItems = useMemo(() => {
        if (!magicItemsData || magicItemsData.length === 0) {
            return { items: [], index: null };
        }

        // Deduplicate items by index (keep first occurrence) - needed for 2024 data
        const uniqueItemsMap = new Map();
        magicItemsData.forEach(item => {
            if (!uniqueItemsMap.has(item.index)) {
                uniqueItemsMap.set(item.index, item);
            }
        });
        const uniqueItems = Array.from(uniqueItemsMap.values());

        // Merge bookmarked status into items using state
        const itemsWithBookmarks = uniqueItems.map(item => ({
            ...item,
            bookmarked: bookmarkedIndexes.includes(item.index)
        }));

        // Check for index parameter in URL to expand/scroll to specific item
        const index = (searchParams.get('index') || '').replace(/[\s+]/g, '-');
        let foundIndex = null;
        if (index) {
            const found = itemsWithBookmarks.find(item => item.index === index);
            if (found) {
                foundIndex = index;
            }
        }

        return { items: itemsWithBookmarks, index: foundIndex };
    }, [magicItemsData, bookmarkedIndexes, searchParams]);

    const magicItems = processedItems.items;

    // Expand/collapse card handler
    const expandCard = useCallback((index, expanded) => {
        if (expanded) {
            setShownCard(index);
            requestAnimationFrame(() => scrollIntoView(index));
            setSearchParams({ index });
        } else {
            setShownCard('');
            setSearchParams({});
        }
    }, [setSearchParams]);

    // Filter predicate - handles both 5e and 2024 item shapes
    const showMagicItem = useCallback((magicItem) => {
        // Attunement filter
        if (filter.attunement !== 'All' && (
            (filter.attunement === 'Required' && !magicItem.requiresAttunement) ||
            (filter.attunement === 'Not Required' && magicItem.requiresAttunement)
        )) {
            return false;
        }

        // Bookmarked filter
        if (filter.bookmarked !== 'All' && !magicItem.bookmarked) {
            return false;
        }

        // Name filter (case-insensitive)
        if (filter.name !== '' && !magicItem.name.toLowerCase().includes(filter.name.toLowerCase())) {
            return false;
        }

        // Rarity filter (case-insensitive for 2024 compatibility)
        if (filter.rarity !== 'All' && magicItem.rarity) {
            if (magicItem.rarity.toLowerCase() !== filter.rarity.toLowerCase()) {
                return false;
            }
        } else if (filter.rarity !== 'All' && !magicItem.rarity) {
            return false;
        }

        // Type filter (case-insensitive for 2024 compatibility)
        if (filter.type !== 'All' && magicItem.type) {
            if (magicItem.type.toLowerCase() !== filter.type.toLowerCase()) {
                return false;
            }
        } else if (filter.type !== 'All' && !magicItem.type) {
            return false;
        }

        return true;
    }, [filter]);

    // Bookmark change handler with version-aware persistence
    const handleBookmarkChange = useCallback((index, isBookmarked) => {
        if (isBookmarked) {
            const updated = [...bookmarkedIndexes, index];
            setBookmarkedIndexes(updated);
            setLocalStorageItem(bookmarkedKey, updated);
        } else {
            const updated = bookmarkedIndexes.filter(i => i !== index);
            setBookmarkedIndexes(updated);
            setLocalStorageItem(bookmarkedKey, updated);
        }
    }, [bookmarkedIndexes, bookmarkedKey]);

    // Memoized filtered items
    const filteredItems = useMemo(
        () => magicItems.filter(showMagicItem),
        [magicItems, showMagicItem]
    );

    // Process URL index when data is available
    useEffect(() => {
        if (processedItems.index) {
            setShownCard(processedItems.index); // eslint-disable-line react-hooks/set-state-in-effect
            requestAnimationFrame(() => scrollIntoView(processedItems.index));
        }
    }, [processedItems.index]);

    // Loading state
    if (magicItemsLoading) {
        return <div className="list"><div>Loading magic items...</div></div>;
    }

    // Normalize using the consolidated (2024-style) data shape
    const normalizeItem = normalizeMagicItem2024;
    const sectionRenderers = MagicItemSections;

    // Filter form component
    const FilterForm = MagicItems2024FilterForm;

    return (
        <>
            <FilterForm
                filter={filter}
                setFilter={setFilter}
            />

            <div className="list">
                {filteredItems.map((magicItem) => {
                    const normalizedItem = normalizeItem(magicItem);
                    return (
                        <div key={magicItem.index} id={magicItem.index} data-item-index={magicItem.index}>
                            <MagicItemCard
                                magicItem={normalizedItem}
                                expand={shownCard === magicItem.index}
                                onExpand={(expanded) => expandCard(magicItem.index, expanded)}
                                onBookmarkChange={handleBookmarkChange}
                                sectionRenderers={sectionRenderers}
                            />
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default MagicItems;
