import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEquipment, useWeaponProperties } from '../../data/dataService';
import { scrollIntoView } from '../../data/utils';
import { useRuleVersion } from '../../context/RuleVersionContext';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem, sanitizeFilter } from '../../utils/localStorage';
import EquipmentItem from './EquipmentItem';
import EquipmentFilterForm from './EquipmentFilterForm';
import WeaponPropertyDescription from './WeaponPropertyDescription';
import EquipmentItemList from './EquipmentItemList';
import './EquipmentItems.css';

// Extracted: Equipment item filtering logic
function showEquipmentItem(equipmentItem, filter) {
    if (!filter) return true;
    // Bookmarked filter
    if ((filter.bookmarked || 'All') !== 'All' && !equipmentItem.bookmarked) {
        return false;
    }
    // Category filter
    if ((filter.category || 'All') !== 'All' && equipmentItem.equipment_category !== filter.category) {
        return false;
    }
    // Property filter (for weapons only)
    if (filter.category === 'Weapon' && (filter.property || 'All') !== 'All') {
        const hasProperty = equipmentItem.properties?.some(p => p === filter.property);
        if (!hasProperty) {
            return false;
        }
    }
    // Name filter
    if ((filter.name || '') !== '' && !equipmentItem.name.toLowerCase().includes((filter.name || '').toLowerCase())) {
        return false;
    }
    // Range filter (for weapons only)
    if (filter.category === 'Weapon' && (filter.range || 'All') !== 'All') {
        const weaponRange = equipmentItem.weapon_range?.toLowerCase().replace('meele', 'melee');
        if (weaponRange !== filter.range.toLowerCase()) {
            return false;
        }
    }
    return true;
}

// Extracted: Rule version filtering
function filterByRuleVersion(equipmentItem, ruleVersion) {
    if (!equipmentItem.rules) {
        return true;
    }
    if (equipmentItem.rules === ruleVersion) {
        return true;
    }
    if (equipmentItem.equipment_category === 'Tools') {
        return true;
    }
    return false;
}

function EquipmentItems() {
    const { ruleVersion } = useRuleVersion();
    const [filter, setFilter] = useState(() => {
        const savedFilter = getLocalStorageItem(LOCAL_STORAGE_KEYS.EQUIPMENT_ITEMS_FILTER);
        if (savedFilter) {
            const equipDefaultFilter = { category: 'All', bookmarked: 'All', name: '', property: 'All', range: 'All' };
            return sanitizeFilter ? sanitizeFilter(equipDefaultFilter, savedFilter) : savedFilter;
        }
        return {
            category: 'All',
            bookmarked: 'All',
            name: '',
            property: 'All',
            range: 'All'
        };
    });
    const [bookmarkedIndexes, setBookmarkedIndexes] = useState(() => {
        const saved = getLocalStorageItem(LOCAL_STORAGE_KEYS.EQUIPMENT_ITEMS_BOOKMARKED);
        return saved || [];
    });
    const [shownCard, setShownCard] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: equipmentData, loading: equipmentLoading } = useEquipment();
    const { data: weaponPropertiesData, loading: wpLoading } = useWeaponProperties();

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

    const getWeaponPropertyDescription = (name) => {
        const wp = weaponPropertiesData.find(wp => wp.name === name);
        return wp ? wp.desc : '';
    };

    const filterChanged = (newFilter) => {
        setLocalStorageItem(LOCAL_STORAGE_KEYS.EQUIPMENT_ITEMS_FILTER, newFilter);
    };

    // Process URL index when data is available (moved to effect to avoid setState during render)
    useEffect(() => {
        if (equipmentData && equipmentData.length > 0) {
            const index = searchParams.get('index');
            if (index) {
                const equipmentItem = equipmentData.find(item => item.index === index);
                if (equipmentItem) {
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    setShownCard(index);
                    requestAnimationFrame(() => scrollIntoView(index));
                }
            } else {
                const savedFilter = getLocalStorageItem(LOCAL_STORAGE_KEYS.EQUIPMENT_ITEMS_FILTER);
                if (!savedFilter) {
                    setLocalStorageItem(LOCAL_STORAGE_KEYS.EQUIPMENT_ITEMS_FILTER, filter);
                }
            }
        }
    }, [equipmentData, filter]);

    if (equipmentLoading || wpLoading) {
        return <div className="list"><div>Loading equipment...</div></div>;
    }

    const safeEquipmentData = equipmentData || [];

    const equipmentItemsBookmarked = bookmarkedIndexes;

    const processedItems = safeEquipmentData.map(item => ({
        ...item,
        bookmarked: equipmentItemsBookmarked.includes(item.index)
    }));

    const filteredItems = processedItems
        .filter(item => showEquipmentItem(item, filter))
        .filter(item => filterByRuleVersion(item, ruleVersion));

    const handleBookmarkChange = (index, isBookmarked) => {
        let updatedIndexes;
        if (isBookmarked) {
            updatedIndexes = [...bookmarkedIndexes, index];
        } else {
            updatedIndexes = bookmarkedIndexes.filter(i => i !== index);
        }
        setBookmarkedIndexes(updatedIndexes);
        setLocalStorageItem(LOCAL_STORAGE_KEYS.EQUIPMENT_ITEMS_BOOKMARKED, updatedIndexes);
    };

    return (
        <>
            <EquipmentFilterForm
                filter={filter}
                setFilter={setFilter}
                onFilterChange={filterChanged}
            />

            <WeaponPropertyDescription
                category={filter.category}
                property={filter.property}
                getWeaponPropertyDescription={getWeaponPropertyDescription}
            />

            <EquipmentItemList
                filteredItems={filteredItems}
                showEquipmentItem={showEquipmentItem}
                shownCard={shownCard}
                expandCard={expandCard}
                handleBookmarkChange={handleBookmarkChange}
                ruleVersion={ruleVersion}
            />
        </>
    );
}

export default EquipmentItems;
