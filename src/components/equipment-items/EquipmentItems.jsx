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

// Extracted: Bookmark change handler
function handleBookmarkChange(equipmentItems, setEquipmentItems, index, isBookmarked) {
    setEquipmentItems(prevItems =>
        prevItems.map(item =>
            item.index === index ? { ...item, bookmarked: isBookmarked } : item
        )
    );

    const equipmentItemsBookmarked = equipmentItems
        .filter(item => item.bookmarked)
        .map(item => item.index);

    if (isBookmarked) {
        equipmentItemsBookmarked.push(index);
        setLocalStorageItem(LOCAL_STORAGE_KEYS.EQUIPMENT_ITEMS_BOOKMARKED, equipmentItemsBookmarked);
    } else {
        const filtered = equipmentItemsBookmarked.filter(i => i !== index);
        setLocalStorageItem(LOCAL_STORAGE_KEYS.EQUIPMENT_ITEMS_BOOKMARKED, filtered);
    }
}

function EquipmentItems() {
    const { ruleVersion } = useRuleVersion();
    const [equipmentItems, setEquipmentItems] = useState([]);
    const [weaponProperties, setWeaponProperties] = useState([]);
    const [filter, setFilter] = useState({
        category: 'All',
        bookmarked: 'All',
        name: '',
        property: 'All',
        range: 'All'
    });
    const [shownCard, setShownCard] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: equipmentData, loading: equipmentLoading } = useEquipment();
    const { data: weaponPropertiesData, loading: wpLoading } = useWeaponProperties();

    useEffect(() => {
        if (equipmentData && equipmentData.length > 0) {
            setEquipmentItems(equipmentData);

            // Check for index parameter in URL
            const index = searchParams.get('index');
            if (index && shownCard === '') {
                const equipmentItem = equipmentData.find(item => item.index === index);
                if (equipmentItem) {
                    setShownCard(index);
                    scrollIntoView(index);
                }
            } else {
                // Set search filters from localStorage
                const savedFilter = getLocalStorageItem(LOCAL_STORAGE_KEYS.EQUIPMENT_ITEMS_FILTER);
                if (savedFilter) {
                    const equipDefaultFilter = { category: 'All', bookmarked: 'All', name: '', property: 'All', range: 'All' };
                    setFilter(sanitizeFilter(equipDefaultFilter, savedFilter));
                } else {
                    setLocalStorageItem(LOCAL_STORAGE_KEYS.EQUIPMENT_ITEMS_FILTER, filter);
                }
            }

            // Set bookmarked status from localStorage
            const equipmentItemsBookmarkedJson = getLocalStorageItem(LOCAL_STORAGE_KEYS.EQUIPMENT_ITEMS_BOOKMARKED);
            let equipmentItemsBookmarked = [];
            if (equipmentItemsBookmarkedJson) {
                equipmentItemsBookmarked = equipmentItemsBookmarkedJson;
            }

            // Update bookmarked status for each item
            const updatedItems = equipmentData.map(item => ({
                ...item,
                bookmarked: equipmentItemsBookmarked.includes(item.index)
            }));
            setEquipmentItems(updatedItems);
        }

        if (weaponPropertiesData) {
            setWeaponProperties(weaponPropertiesData);
        }
    }, [equipmentData, weaponPropertiesData, searchParams]);

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

    const getWeaponPropertyDescription = (name) => {
        const wp = weaponProperties.find(wp => wp.name === name);
        return wp ? wp.desc : '';
    };

    const filterChanged = (newFilter) => {
        setLocalStorageItem(LOCAL_STORAGE_KEYS.EQUIPMENT_ITEMS_FILTER, newFilter);
    };

    if (equipmentLoading || wpLoading) {
        return <div className="list"><div>Loading equipment...</div></div>;
    }

    const filteredItems = equipmentItems
        .filter(item => showEquipmentItem(item, filter))
        .filter(item => filterByRuleVersion(item, ruleVersion));

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
                handleBookmarkChange={(index, isBookmarked) => handleBookmarkChange(equipmentItems, setEquipmentItems, index, isBookmarked)}
                ruleVersion={ruleVersion}
            />
        </>
    );
}

export default EquipmentItems;
