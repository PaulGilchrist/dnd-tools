import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useVersionedData } from '../../hooks/useVersionedData';
import { useRuleVersion } from '../../context/RuleVersionContext';
import { scrollIntoView } from '../../data/utils';
import { LOCAL_STORAGE_KEYS, getVersionedStorageKey, getLocalStorageItem, setLocalStorageItem, sanitizeFilter } from '../../utils/localStorage';
import MagicItemCard from '../common/MagicItemCard';
import MagicItemSections from '../common/MagicItemSections';
import { normalizeMagicItem5e, normalizeMagicItem2024 } from '../adapters/magicItemAdapters';
import MagicItemsFilterForm from './MagicItemsFilterForm';
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
    const { ruleVersion } = useRuleVersion();
    const [searchParams, setSearchParams] = useSearchParams();

    // Version-aware data fetching
    const { data: magicItemsData, loading: magicItemsLoading } = useVersionedData('magicItems');

    // Version-aware storage keys
    const filterKey = getVersionedStorageKey(LOCAL_STORAGE_KEYS.MAGIC_ITEMS_FILTER, ruleVersion);
    const bookmarkedKey = getVersionedStorageKey(LOCAL_STORAGE_KEYS.MAGIC_ITEMS_BOOKMARKED, ruleVersion);

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

        // Load bookmarked items from localStorage
        const bookmarkedJson = getLocalStorageItem(bookmarkedKey);
        let bookmarkedIndexes = [];
        if (bookmarkedJson) {
            try {
                bookmarkedIndexes = bookmarkedJson;
            } catch (e) {
                console.error('Error parsing bookmarked items:', e);
            }
        }

        // Merge bookmarked status into items
        const itemsWithBookmarks = uniqueItems.map(item => ({
            ...item,
            bookmarked: bookmarkedIndexes.includes(item.index)
        }));

        // Check for index parameter in URL to expand/scroll to specific item
        const index = searchParams.get('index');
        let foundIndex = null;
        if (index) {
            const found = itemsWithBookmarks.find(item => item.index === index);
            if (found) {
                foundIndex = index;
            }
        }

        return { items: itemsWithBookmarks, index: foundIndex };
    }, [magicItemsData, bookmarkedKey, searchParams]);

    // Set shownCard and scroll when URL index is found
    const handleUrlIndex = (index) => {
        if (index) {
            setShownCard(index);
            requestAnimationFrame(() => scrollIntoView(index));
        }
    };

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
        // Update local state immediately so UI reflects the change
        // eslint-disable-next-line no-undef
        setMagicItems(prevItems =>
            prevItems.map(item =>
                item.index === index ? { ...item, bookmarked: isBookmarked } : item
            )
        );

        // Compute current bookmarked indexes from state and persist
        const currentBookmarked = magicItems
            .map(item => ({ ...item, bookmarked: item.index === index ? isBookmarked : item.bookmarked }))
            .filter(item => item.bookmarked)
            .map(item => item.index);

        setLocalStorageItem(bookmarkedKey, currentBookmarked);
    }, [magicItems, bookmarkedKey]);

    // Memoized filtered items
    const filteredItems = useMemo(
        () => magicItems.filter(showMagicItem),
        [magicItems, showMagicItem]
    );

    // Process URL index when data is available
    useEffect(() => {
        handleUrlIndex(processedItems.index);
    }, [processedItems.index]);

    // Loading state
    if (magicItemsLoading) {
        return <div className="list"><div>Loading magic items...</div></div>;
    }

    // Normalize function and section renderers based on rule version
    const normalizeItem = ruleVersion === '2024' ? normalizeMagicItem2024 : normalizeMagicItem5e;
    const sectionRenderers = ruleVersion === '2024' ? MagicItemSections : undefined;

    // Filter form component based on rule version
    const FilterForm = ruleVersion === '2024' ? MagicItems2024FilterForm : MagicItemsFilterForm;

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
