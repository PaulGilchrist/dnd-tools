import { useState } from 'react';

function EquipmentFilterForm({ filter, setFilter, onFilterChange }) {
    const handleNameChange = (e) => {
        const newFilter = { ...filter, name: e.target.value };
        setFilter(newFilter);
        onFilterChange(newFilter);
    };

    const handleCategoryChange = (e) => {
        const newFilter = { ...filter, category: e.target.value };
        setFilter(newFilter);
        onFilterChange(newFilter);
    };

    const handleRangeChange = (e) => {
        const newFilter = { ...filter, range: e.target.value };
        setFilter(newFilter);
        onFilterChange(newFilter);
    };

    const handlePropertyChange = (e) => {
        const newFilter = { ...filter, property: e.target.value };
        setFilter(newFilter);
        onFilterChange(newFilter);
    };

    const handleBookmarkedChange = (e) => {
        const newFilter = { ...filter, bookmarked: e.target.value };
        setFilter(newFilter);
        onFilterChange(newFilter);
    };

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
                        onChange={handleNameChange}
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
                    onChange={handleCategoryChange}
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
                            onChange={handleRangeChange}
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
                            onChange={handlePropertyChange}
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
                    onChange={handleBookmarkedChange}
                >
                    <option>All</option>
                    <option>Bookmarked</option>
                </select>
            </form>

            {/* Weapon Property Description */}
            {filter.category === 'Weapon' && filter.property !== 'All' && (
                <div className="weapon-property-description">
                    <b>Weapon Property - {filter.property}</b><br />
                </div>
            )}
        </>
    );
}

export default EquipmentFilterForm;
