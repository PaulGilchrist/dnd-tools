import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useEquipment, useWeaponProperties } from '../data/dataService';
import EquipmentItem from './EquipmentItem';
import './EquipmentItems.css';

// Javascript utilities (matching Angular)
const utils = {
    scrollIntoView: function(index) {
        const element = document.getElementById(index);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
};

function EquipmentItems() {
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
                    utils.scrollIntoView(index);
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
            utils.scrollIntoView(index);
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

    const filterChanged = () => {
        localStorage.setItem('equipmentItemsFilter', JSON.stringify(filter));
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

    const filteredItems = equipmentItems.filter(showEquipmentItem);

    return (
        <>
            <form className="filter-form">
                {/* Name */}
                <label htmlFor="name" className="col-form-label">Name</label>
                <div className={`has-error ${filter.name && filter.name.length >= 50 ? 'invalid' : ''}`}>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="name" 
                        name="name"
                        value={filter.name}
                        onChange={(e) => {
                            const newFilter = { ...filter, name: e.target.value };
                            setFilter(newFilter);
                            filterChanged();
                        }}
                        pattern="[A-Za-z ]+" 
                        maxLength="50"
                    />
                    {filter.name && filter.name.length >= 50 && (
                        <div className="alert alert-danger">
                            Name should be less than 50 characters
                        </div>
                    )}
                </div>

                {/* Category */}
                <label htmlFor="category" className="col-form-label">Category</label>
                <select 
                    name="category" 
                    className="form-control"
                    value={filter.category}
                    onChange={(e) => {
                        const newFilter = { ...filter, category: e.target.value };
                        setFilter(newFilter);
                        filterChanged();
                    }}
                >
                    <option>All</option>
                    <option>Adventuring Gear</option>
                    <option>Armor</option>
                    <option>Mounts and Vehicles</option>
                    <option>Property</option>
                    <option>Tools</option>
                    <option>Weapon</option>
                </select>

                {/* Range (only for weapons) */}
                {filter.category === 'Weapon' && (
                    <>
                        <label htmlFor="range" className="col-form-label">Range</label>
                        <select 
                            name="range" 
                            className="form-control"
                            value={filter.range}
                            onChange={(e) => {
                                const newFilter = { ...filter, range: e.target.value };
                                setFilter(newFilter);
                                filterChanged();
                            }}
                        >
                            <option>All</option>
                            <option>Melee</option>
                            <option>Ranged</option>
                        </select>
                    </>
                )}

                {/* Properties (only for weapons) */}
                {filter.category === 'Weapon' && (
                    <>
                        <label htmlFor="property" className="col-form-label">Property</label>
                        <select 
                            name="property" 
                            className="form-control"
                            value={filter.property}
                            onChange={(e) => {
                                const newFilter = { ...filter, property: e.target.value };
                                setFilter(newFilter);
                                filterChanged();
                            }}
                        >
                            <option>All</option>
                            <option>Ammunition</option>
                            <option>Finesse</option>
                            <option>Heavy</option>
                            <option>Light</option>
                            <option>Loading</option>
                            <option>Monk</option>
                            <option>Reach</option>
                            <option>Thrown</option>
                            <option>Two-Handed</option>
                            <option>Versatile</option>
                        </select>
                    </>
                )}

                {/* Bookmarked */}
                <label htmlFor="bookmarked" className="col-form-label">Bookmarked</label>
                <select 
                    name="bookmarked" 
                    className="form-control"
                    value={filter.bookmarked}
                    onChange={(e) => {
                        const newFilter = { ...filter, bookmarked: e.target.value };
                        setFilter(newFilter);
                        filterChanged();
                    }}
                >
                    <option>All</option>
                    <option>Bookmarked</option>
                </select>
            </form>

            {/* Weapon Property Description */}
            {filter.category === 'Weapon' && filter.property !== 'All' && (
                <div className="weapon-property-description">
                    <b>Weapon Property - {filter.property}</b><br />
                    {getWeaponPropertyDescription(filter.property)}
                </div>
            )}

            {/* Equipment Items List */}
            <div className="list">
                {filteredItems.map((equipmentItem) => (
                    <div key={equipmentItem.index} id={equipmentItem.index}>
                        {showEquipmentItem(equipmentItem) && (
                            <EquipmentItem 
                                equipmentItem={equipmentItem}
                                expand={shownCard === equipmentItem.index}
                                onExpand={(expanded) => expandCard(equipmentItem.index, expanded)}
                                onBookmarkChange={handleBookmarkChange}
                            />
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}

export default EquipmentItems;
