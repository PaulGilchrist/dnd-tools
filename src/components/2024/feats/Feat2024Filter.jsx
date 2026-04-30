import { useState } from 'react';

function Feat2024Filter({ filter, onFilterChange }) {
    const handleChange = (field, value) => {
        if (onFilterChange) {
            onFilterChange({ ...filter, [field]: value });
         }
     };

    const featTypes = ['All', 'General Feat', 'Fighting Style Feat', 'Origin Feat', 'Epic Boon Feat'];
    const abilities = ['All', 'Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];
    const repeatableOptions = ['All', 'Yes', 'No'];

    return (
         <form className="filter-form">
             {/* Name Search */}
             <label htmlFor="name" className="col-form-label">Name</label>
             <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={filter.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Search feats..."
             />

             {/* Feat Type */}
             <label htmlFor="type" className="col-form-label">Type</label>
             <select
                name="type"
                className="form-control"
                id="type"
                value={filter.type}
                onChange={(e) => handleChange('type', e.target.value)}
             >
                 {featTypes.map((type) => (
                     <option key={type} value={type}>
                         {type}
                     </option>
                 ))}
             </select>

             {/* Repeatable */}
             <label htmlFor="repeatable" className="col-form-label">Repeatable</label>
             <select
                name="repeatable"
                className="form-control"
                id="repeatable"
                value={filter.repeatable}
                onChange={(e) => handleChange('repeatable', e.target.value)}
             >
                 {repeatableOptions.map((option) => (
                     <option key={option} value={option}>
                         {option}
                     </option>
                 ))}
             </select>

             {/* Minimum Level */}
             <label htmlFor="minLevel" className="col-form-label">Min Level</label>
             <input
                type="number"
                className="form-control"
                id="minLevel"
                name="minLevel"
                value={filter.minLevel}
                onChange={(e) => handleChange('minLevel', parseInt(e.target.value) || 0)}
                min="0"
                max="20"
                step="1"
             />

             {/* Ability Score Filter */}
             <label htmlFor="abilityScore" className="col-form-label">Ability Score</label>
             <select
                name="abilityScore"
                className="form-control"
                id="abilityScore"
                value={filter.abilityScore}
                onChange={(e) => handleChange('abilityScore', e.target.value)}
             >
                 {abilities.map((ability) => (
                     <option key={ability} value={ability}>
                         {ability}
                     </option>
                 ))}
             </select>
         </form>
     );
}

export default Feat2024Filter;