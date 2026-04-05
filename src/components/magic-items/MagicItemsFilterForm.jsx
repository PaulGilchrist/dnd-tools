import { useState } from 'react';

function MagicItemsFilterForm({ filter, setFilter, onFilterChange }) {
    const handleNameChange = (e) => {
        const newFilter = { ...filter, name: e.target.value };
        setFilter(newFilter);
        onFilterChange(newFilter);
    };

    const handleRarityChange = (e) => {
        const newFilter = { ...filter, rarity: e.target.value };
        setFilter(newFilter);
        onFilterChange(newFilter);
    };

    const handleTypeChange = (e) => {
        const newFilter = { ...filter, type: e.target.value };
        setFilter(newFilter);
        onFilterChange(newFilter);
    };

    const handleAttunementChange = (e) => {
        const newFilter = { ...filter, attunement: e.target.value };
        setFilter(newFilter);
        onFilterChange(newFilter);
    };

    const handleBookmarkedChange = (e) => {
        const newFilter = { ...filter, bookmarked: e.target.value };
        setFilter(newFilter);
        onFilterChange(newFilter);
    };

    return (
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

            {/* Rarity */}
            <label htmlFor="rarity" className="col-form-label">Rarity</label>
            <select 
                name="rarity" 
                className="form-control"
                value={filter.rarity}
                onChange={handleRarityChange}
            >
                <option>All</option>
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="very rare">Very Rare</option>
                <option value="legendary">Legendary</option>
            </select>

            {/* Type */}
            <label htmlFor="type" className="col-form-label">Type</label>
            <select 
                name="type" 
                className="form-control"
                value={filter.type}
                onChange={handleTypeChange}
            >
                <option>All</option>
                <option>Armor</option>
                <option>Potion</option>
                <option>Ring</option>
                <option>Scroll</option>
                <option>Wand</option>
                <option>Weapon</option>
                <option>Wondrous item</option>
            </select>

            {/* Attunement */}
            <label htmlFor="attunement" className="col-form-label">Attunement</label>
            <select 
                name="attunement" 
                className="form-control"
                value={filter.attunement}
                onChange={handleAttunementChange}
            >
                <option>All</option>
                <option>Required</option>
                <option>Not Required</option>
            </select>

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
    );
}

export default MagicItemsFilterForm;
