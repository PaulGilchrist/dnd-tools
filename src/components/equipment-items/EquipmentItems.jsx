import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useEquipment, useWeaponProperties } from '../../data/dataService';
import { scrollIntoView } from '../../data/utils';
import { useRuleVersion } from '../../context/RuleVersionContext';
import EquipmentItem from './EquipmentItem';
import EquipmentFilterForm from './EquipmentFilterForm';
import WeaponPropertyDescription from './WeaponPropertyDescription';
import EquipmentItemList from './EquipmentItemList';
import './EquipmentItems.css';

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
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch data
    const { data: equipmentData, loading: equipmentLoading } = useEquipment();
    const { data: weaponPropertiesData, loading: wpLoading } = useWeaponProperties();

    useEffect(() => {
        if (equipmentData && equipmentData.length > 0) {
            setEquipmentItems(equipmentData);
            console.log(`${equipmentData.length} equipment items`);

            // Check for index parameter in URL
            const index = searchParams.get('index');
            if (index) {
                const equipmentItem = equipmentData.find(item => item.index === index);
                if (equipmentItem) {
                    setShownCard(index);
                    scrollIntoView(index);
                }
            } else {
                // Set search filters from localStorage
                const savedFilter = localStorage.getItem('equipmentItemsFilter');
                if (savedFilter) {
                    setFilter(JSON.parse(savedFilter));
                } else {
                    localStorage.setItem('equipmentItemsFilter', JSON.stringify(filter));
                }
            }

            // Set bookmarked status from localStorage
            const equipmentItemsBookmarkedJson = localStorage.getItem('equipmentItemsBookmarked');
            let equipmentItemsBookmarked = [];
            if (equipmentItemsBookmarkedJson) {
                equipmentItemsBookmarked = JSON.parse(equipmentItemsBookmarkedJson);
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
    }, [equipmentData, weaponPropertiesData]);

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
        localStorage.setItem('equipmentItemsFilter', JSON.stringify(newFilter));
    };

    const saveBookmark = () => {
        const equipmentItemsBookmarked = equipmentItems
            .filter(item => item.bookmarked)
            .map(item => item.index);
        localStorage.setItem('equipmentItemsBookmarked', JSON.stringify(equipmentItemsBookmarked));
    };

    const showEquipmentItem = (equipmentItem) => {
        // Bookmarked filter
        if (filter.bookmarked !== 'All' && !equipmentItem.bookmarked) {
            return false;
        }
        // Category filter
        if (filter.category !== 'All' && equipmentItem.equipment_category !== filter.category) {
            return false;
        }
        // Property filter (for weapons only)
        if (filter.category === 'Weapon' && filter.property !== 'All') {
            const hasProperty = equipmentItem.properties?.some(p => p === filter.property);
            if (!hasProperty) {
                return false;
            }
        }
        // Name filter
        if (filter.name !== '' && !equipmentItem.name.toLowerCase().includes(filter.name.toLowerCase())) {
            return false;
        }
        // Range filter (for weapons only)
        if (filter.category === 'Weapon' && filter.range !== 'All') {
            // Handle both "Melee" and "Meele" (typo in data)
            const weaponRange = equipmentItem.weapon_range?.toLowerCase().replace('meele', 'melee');
            if (weaponRange !== filter.range.toLowerCase()) {
                return false;
            }
        }
        return true;
    };

    const handleBookmarkChange = (index, isBookmarked) => {
        // Update local state immediately so UI reflects the change
        setEquipmentItems(prevItems => 
            prevItems.map(item => 
                item.index === index ? { ...item, bookmarked: isBookmarked } : item
            )
        );
        
        // Save to localStorage - get current bookmarked items from state
        const equipmentItemsBookmarked = equipmentItems
            .filter(item => item.bookmarked)
            .map(item => item.index);
        
        if (isBookmarked) {
            // Add to bookmarked list
            equipmentItemsBookmarked.push(index);
        } else {
            // Remove from bookmarked list
            const filtered = equipmentItemsBookmarked.filter(i => i !== index);
            localStorage.setItem('equipmentItemsBookmarked', JSON.stringify(filtered));
        }
        
        if (isBookmarked) {
            localStorage.setItem('equipmentItemsBookmarked', JSON.stringify(equipmentItemsBookmarked));
        }
    };

    if (equipmentLoading || wpLoading) {
        return <div className="list"><div>Loading equipment...</div></div>;
    }

    const filterByRuleVersion = (equipmentItem) => {
        // If equipmentItem.rules does not exist, show the item (applies to all rule versions)
        if (!equipmentItem.rules) {
            return true;
        }
        
        // If equipmentItem.rules exists and matches ruleVersion, show the item.  Always show tools, just displayed differently based on ruleVersion
        if (equipmentItem.rules === ruleVersion) {
            return true;
        }
        
        // Always show tools, just displayed differently based on ruleVersion
        if (equipmentItem.equipment_category === 'Tools') {
            return true;
        }
        
        // If equipmentItem.rules exists but does not match ruleVersion, skip the item
        return false;
    };

    const filteredItems = equipmentItems
        .filter(showEquipmentItem)
        .filter(filterByRuleVersion);

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
