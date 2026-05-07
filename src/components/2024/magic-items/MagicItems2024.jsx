import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { use2024MagicItems } from '../../../data/dataService';
import { scrollIntoView } from '../../../data/utils';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem, sanitizeFilter } from '../../../utils/localStorage';
import MagicItem2024 from './MagicItem2024';
import MagicItems2024FilterForm from './MagicItems2024FilterForm';
import MagicItems2024List from './MagicItems2024List';

function MagicItems2024() {
    const [filter, setFilter] = useState(() => {
        const savedFilter = getLocalStorageItem(LOCAL_STORAGE_KEYS.MAGIC_ITEMS_FILTER_2024);
        if (savedFilter) {
            try {
                const miDefaultFilter = { bookmarked: 'All', attunement: 'All', name: '', rarity: 'All', type: 'All' };
                return sanitizeFilter(miDefaultFilter, savedFilter);
            } catch (e) {
                console.error('Error parsing saved filter:', e);
            }
        }
        return {
            bookmarked: 'All',
            attunement: 'All',
            name: '',
            rarity: 'All',
            type: 'All'
        };
    });
    const [shownCard, setShownCard] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: magicItemsData, loading: magicItemsLoading } = use2024MagicItems();

    // Handle URL index parameter
    const handleUrlIndex = (data, params) => {
        if (data && data.length > 0) {
            const index = params.get('index');
            if (index) {
                const uniqueItemsMap = new Map();
                data.forEach(item => {
                    if (!uniqueItemsMap.has(item.index)) {
                        uniqueItemsMap.set(item.index, item);
                    }
                });
                const uniqueItems = Array.from(uniqueItemsMap.values());
                const magicItem = uniqueItems.find(item => item.index === index);
                if (magicItem) {
                    setShownCard(index);
                    // Scroll after state update completes
                    requestAnimationFrame(() => scrollIntoView(index));
                }
            }
        }
    };

    const expandCard = (index, expanded) => {
        if (expanded) {
            setShownCard(index);
            requestAnimationFrame(() => scrollIntoView(index));
        } else {
            setShownCard('');
        }

        // Update URL query params using setSearchParams
        if (expanded) {
            setSearchParams({ index });
        } else {
            setSearchParams({});
                }
             };

    const filterChanged = (newFilter) => {
        setLocalStorageItem(LOCAL_STORAGE_KEYS.MAGIC_ITEMS_FILTER_2024, newFilter);
             };

    const showMagicItem = (magicItem) => {
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
                 // Name filter
        if (filter.name !== '' && !magicItem.name.toLowerCase().includes(filter.name.toLowerCase())) {
            return false;
              }
                 // Rarity filter (case-insensitive)
        if (filter.rarity !== 'All' && magicItem.rarity && magicItem.rarity.toLowerCase() !== filter.rarity.toLowerCase()) {
            return false;
              }
                 // Type filter (case-insensitive)
        if (filter.type !== 'All' && magicItem.type.toLowerCase() !== filter.type.toLowerCase()) {
            return false;
        }
        return true;
    };

    const handleBookmarkChange = (index, isBookmarked) => {
        // Save to localStorage
        const magicItemsBookmarked = magicItemsData
            .filter(item => item.bookmarked)
            .map(item => item.index);

        if (isBookmarked) {
            magicItemsBookmarked.push(index);
        } else {
            const filtered = magicItemsBookmarked.filter(i => i !== index);
            setLocalStorageItem(LOCAL_STORAGE_KEYS.MAGIC_ITEMS_BOOKMARKED_2024, filtered);
        }

        if (isBookmarked) {
            setLocalStorageItem(LOCAL_STORAGE_KEYS.MAGIC_ITEMS_BOOKMARKED_2024, magicItemsBookmarked);
        }
    };

    // Process URL index when data is available
    useEffect(() => {
        handleUrlIndex(magicItemsData, searchParams);
    }, [magicItemsData, searchParams]);

    if (magicItemsLoading) {
        return <div className="list"><div>Loading magic items...</div></div>;
    }

    // Deduplicate and merge bookmarks for rendering
    const uniqueItemsMap = new Map();
    magicItemsData.forEach(item => {
        if (!uniqueItemsMap.has(item.index)) {
            uniqueItemsMap.set(item.index, item);
        }
    });
    const uniqueItems = Array.from(uniqueItemsMap.values());

    const magicItemsBookmarkedJson = getLocalStorageItem(LOCAL_STORAGE_KEYS.MAGIC_ITEMS_BOOKMARKED_2024);
    let magicItemsBookmarked = [];
    if (magicItemsBookmarkedJson) {
        try {
            magicItemsBookmarked = magicItemsBookmarkedJson;
        } catch (e) {
            console.error('Error parsing bookmarked items:', e);
        }
    }

    const processedItems = uniqueItems.map(item => ({
        ...item,
        bookmarked: magicItemsBookmarked.includes(item.index)
    }));

    const filteredItems = processedItems.filter(showMagicItem);

    return (
                  <>
                      <MagicItems2024FilterForm
                filter={filter}
                setFilter={setFilter}
                onFilterChange={filterChanged}
            />

            <MagicItems2024List
                filteredItems={filteredItems}
                showMagicItem={showMagicItem}
                shownCard={shownCard}
                expandCard={expandCard}
                handleBookmarkChange={handleBookmarkChange}
                      />
                  </>
              );
}

export default MagicItems2024;
