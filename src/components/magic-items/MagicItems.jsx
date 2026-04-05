import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useMagicItems } from '../../data/dataService';
import { scrollIntoView } from '../../data/utils';
import MagicItem from './MagicItem';
import MagicItemsFilterForm from './MagicItemsFilterForm';
import MagicItemList from './MagicItemList';
import './MagicItems.css';

function MagicItems() {
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
    const { data: magicItemsData, loading: magicItemsLoading } = useMagicItems();

    useEffect(() => {
        // Load saved filters from localStorage on mount
        const savedFilter = localStorage.getItem('magicItemsFilter');
        if (savedFilter) {
            try {
                setFilter(JSON.parse(savedFilter));
            } catch (e) {
                console.error('Error parsing saved filter:', e);
            }
        }

        if (magicItemsData && magicItemsData.length > 0) {
            setMagicItems(magicItemsData);
            console.log(`${magicItemsData.length} magic items`);

            // Check for index parameter in URL
            const index = searchParams.get('index');
            if (index) {
                const magicItem = magicItemsData.find(item => item.index === index);
                if (magicItem) {
                    setShownCard(index);
                    scrollIntoView(index);
                }
            }

            // Set bookmarked status from localStorage
            const magicItemsBookmarkedJson = localStorage.getItem('magicItemsBookmarked');
            let magicItemsBookmarked = [];
            if (magicItemsBookmarkedJson) {
                try {
                    magicItemsBookmarked = JSON.parse(magicItemsBookmarkedJson);
                } catch (e) {
                    console.error('Error parsing bookmarked items:', e);
                }
            }

            // Update bookmarked status for each item
            const updatedItems = magicItemsData.map(item => ({
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
        localStorage.setItem('magicItemsFilter', JSON.stringify(newFilter));
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
        // Rarity filter
        if (filter.rarity !== 'All' && magicItem.rarity !== filter.rarity) {
            return false;
        }
        // Type filter
        if (filter.type !== 'All' && magicItem.type !== filter.type) {
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
            localStorage.setItem('magicItemsBookmarked', JSON.stringify(filtered));
        }
        
        if (isBookmarked) {
            localStorage.setItem('magicItemsBookmarked', JSON.stringify(magicItemsBookmarked));
        }
    };

    if (magicItemsLoading) {
        return <div className="list"><div>Loading magic items...</div></div>;
    }

    const filteredItems = magicItems.filter(showMagicItem);

    return (
        <>
            <MagicItemsFilterForm
                filter={filter}
                setFilter={setFilter}
                onFilterChange={filterChanged}
            />

            <MagicItemList
                filteredItems={filteredItems}
                showMagicItem={showMagicItem}
                shownCard={shownCard}
                expandCard={expandCard}
                handleBookmarkChange={handleBookmarkChange}
            />
        </>
    );
}

export default MagicItems;

