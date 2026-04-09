import { useState } from 'react';

function SpellFilter({ filter, onFilterChange }) {
    const handleChange = (field, value) => {
        if (onFilterChange) {
            onFilterChange({ ...filter, [field]: value });
        }
    };

        return (
        <form className="spells-2024 filter-form">{/* Name */}
            <label htmlFor="name" className="col-form-label">Name</label>
            <div className={`has-error ${filter.name && filter.name.length >= 50 ? 'invalid' : ''}`}>
                <input 
                    type="text" 
                    className="form-control" 
                    id="name" 
                    name="name"
                    value={filter.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    pattern="[A-Za-z ]+" 
                    maxLength="50"
                />
                {filter.name && filter.name.length >= 50 && (
                    <div className="alert alert-danger">
                        Name should be less than 50 characters
                    </div>
                )}
            </div>

            {/* Class */}
            <label htmlFor="class" className="col-form-label">Class</label>
            <select 
                name="class" 
                className="form-control"
                value={filter.class}
                onChange={(e) => handleChange('class', e.target.value)}
            >
                <option selected>All</option>
                <option>Bard</option>
                <option>Cleric</option>
                <option>Druid</option>
                <option>Paladin</option>
                <option>Ranger</option>
                <option>Sorcerer</option>
                <option>Warlock</option>
                <option>Wizard</option>
            </select>

            {/* Levels */}
            <label htmlFor="levelMin" className="col-form-label">Level Range</label>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                    type="number" 
                    className="form-control level-min-input" 
                    id="levelMin" 
                    name="levelMin"
                    value={filter.levelMin}
                    onChange={(e) => handleChange('levelMin', parseInt(e.target.value) || 0)}
                    min="0" 
                    max="9" 
                    step="1" 
                    placeholder="min"
                />
                <input 
                    type="number" 
                    className="form-control level-max-input" 
                    id="levelMax" 
                    name="levelMax"
                    value={filter.levelMax}
                    onChange={(e) => handleChange('levelMax', parseInt(e.target.value) || 9)}
                    min="0" 
                    max="9" 
                    step="1" 
                    placeholder="max"
                />
            </div>

            {/* Casting Time */}
            <label htmlFor="castingTime" className="col-form-label">Casting Time</label>
            <select 
                name="castingTime" 
                className="form-control"
                value={filter.castingTime}
                onChange={(e) => handleChange('castingTime', e.target.value)}
            >
                <option selected>All</option>
                <option>Action</option>
                <option>Bonus Action</option>
                <option>Non-Ritual, Long Cast Time</option>
                <option>Reaction</option>
                <option>Ritual</option>
            </select>

            {/* Status */}
            <label htmlFor="status" className="col-form-label">Status</label>
            <select 
                name="status" 
                className="form-control"
                value={filter.status}
                onChange={(e) => handleChange('status', e.target.value)}
            >
                <option selected>All</option>
                <option>Known</option>
                <option>Prepared or Known Ritual</option>
            </select>
        </form>
    );
}

export default SpellFilter;