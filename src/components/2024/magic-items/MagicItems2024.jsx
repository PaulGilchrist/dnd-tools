import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { use2024MagicItems } from '../../../data/dataService';
import { scrollIntoView } from '../../../data/utils';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem } from '../../../utils/localStorage';
import MagicItem2024 from './MagicItem2024';
import MagicItems2024FilterForm from './MagicItems2024FilterForm';
import MagicItems2024List from './MagicItems2024List';

function MagicItems2024() {
    const [magicItems, setMagicItems] = useState([]);
    const [filter, setFilter] = useState({
        bookmarked: 'All',
        attunement: 'All',
        name: '',
        rarity: 'All',
        type: 'All'
    });
    const [shownCard, setShownCard] = useState('');
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: magicItemsData, loading: magicItemsLoading } = use2024MagicItems();

    useEffect(() => {
                  // Load saved filters from localStorage on mount
        const savedFilter = getLocalStorageItem(LOCAL_STORAGE_KEYS.MAGIC_ITEMS_FILTER_2024);
        if (savedFilter) {
            try {
                setFilter(savedFilter);
                  } catch (e) {
                console.error('Error parsing saved filter:', e);
        }
              }

        if (magicItemsData && magicItemsData.length > 0) {
            // Deduplicate items by index (keep first occurrence)
            const uniqueItemsMap = new Map();
            magicItemsData.forEach(item => {
                if (!uniqueItemsMap.has(item.index)) {
                    uniqueItemsMap.set(item.index, item);
                  }
              });
            const uniqueItems = Array.from(uniqueItemsMap.values());
            
            setMagicItems(uniqueItems);
            console.log(`${uniqueItems.length} magic items (2024 rules) - deduplicated from ${magicItemsData.length}`);

            // Check for index parameter in URL
            const index = searchParams.get('index');
            if (index) {
                const magicItem = uniqueItems.find(item => item.index === index);
                if (magicItem) {
                    setShownCard(index);
                    scrollIntoView(index);
            }
                  }

                      // Set bookmarked status from localStorage
            const magicItemsBookmarkedJson = getLocalStorageItem(LOCAL_STORAGE_KEYS.MAGIC_ITEMS_BOOKMARKED_2024);
            let magicItemsBookmarked = [];
            if (magicItemsBookmarkedJson) {
                try {
                    magicItemsBookmarked = magicItemsBookmarkedJson;
                      } catch (e) {
                    console.error('Error parsing bookmarked items:', e);
            }
                  }

            // Update bookmarked status for each item
            const updatedItems = uniqueItems.map(item => ({
                ...item,
                bookmarked: magicItemsBookmarked.includes(item.index)
            }));
            setMagicItems(updatedItems);
              }
           }, [magicItemsData]);

    const expandCard = (index, expanded) => {
        if (expanded) {
            setShownCard(index);
            scrollIntoView(index);
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
        // Update local state immediately so UI reflects the change
        setMagicItems(prevItems => 
            prevItems.map(item => 
                item.index === index ? { ...item, bookmarked: isBookmarked } : item
                  )
              );
          
                 // Save to localStorage - get current bookmarked items from state
        const magicItemsBookmarked = magicItems
                  .filter(item => item.bookmarked)
                  .map(item => item.index);
          
        if (isBookmarked) {
            // Add to bookmarked list
            magicItemsBookmarked.push(index);
              } else {
                  // Remove from bookmarked list
            const filtered = magicItemsBookmarked.filter(i => i !== index);
            setLocalStorageItem(LOCAL_STORAGE_KEYS.MAGIC_ITEMS_BOOKMARKED_2024, filtered);
              }
          
        if (isBookmarked) {
            setLocalStorageItem(LOCAL_STORAGE_KEYS.MAGIC_ITEMS_BOOKMARKED_2024, magicItemsBookmarked);
              }
             };

    if (magicItemsLoading) {
        return <div className="list"><div>Loading magic items...</div></div>;
    }

    const filteredItems = magicItems.filter(showMagicItem);

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