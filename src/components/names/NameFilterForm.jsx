import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS, setLocalStorageItem } from '../../utils/localStorage';

function NameFilterForm({ filter, setFilter, filterChanged }) {
    const typeOptions = [
        { value: 'building', label: 'Building' },
        { value: 'race', label: 'Race' }
    ];

    const raceOptions = [
        { value: 'dragonborn', label: 'Dragonborn' },
        { value: 'dwarf', label: 'Dwarf' },
        { value: 'elf', label: 'Elf' },
        { value: 'gnome', label: 'Gnome' },
        { value: 'halfling', label: 'Halfling' },
        { value: 'half-orc', label: 'Half Orc' },
        { value: 'tiefling', label: 'Tiefling' },
        { value: 'human-celtic', label: 'Human (Celtic)' }
    ];

    const sexOptions = [
        { value: 'female', label: 'Female' },
        { value: 'male', label: 'Male' }
    ];

    const usedOptions = [
        { value: 'All', label: 'All' },
        { value: 'available', label: 'Available' },
        { value: 'used', label: 'Used' }
    ];

    const handleTypeChange = (e) => {
        const newFilter = { ...filter, type: e.target.value, index: 'Select' };
        setFilter(newFilter);
        setLocalStorageItem(LOCAL_STORAGE_KEYS.NAMES_FILTER, newFilter);
    };

    const handleIndexChange = (e) => {
        const newFilter = { ...filter, index: e.target.value };
        setFilter(newFilter);
        filterChanged(newFilter);
    };

    const handleSexChange = (e) => {
        const newFilter = { ...filter, sex: e.target.value };
        setFilter(newFilter);
        filterChanged(newFilter);
    };

    const handleUsedChange = (e) => {
        const newFilter = { ...filter, used: e.target.value };
        setFilter(newFilter);
        filterChanged(newFilter);
    };

    return (
        <form className="filter-form">
            {/* Type */}
            <label htmlFor="type" className="col-form-label">Type</label>
            <select 
                name="type" 
                className="form-control"
                value={filter.type}
                onChange={handleTypeChange}
            >
                <option disabled>Select</option>
                {typeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>

            {/* Index */}
            <label htmlFor="index" className="col-form-label">
                {filter.type === 'building' && <span>Building</span>}
                {filter.type === 'race' && <span>Race</span>}
            </label>
            <select 
                name="index" 
                className="form-control"
                value={filter.index}
                onChange={handleIndexChange}
            >
                <option disabled>Select</option>
                {filter.type === 'building' && (
                    <>
                        <option value="tavern">Tavern</option>
                    </>
                )}
                {filter.type === 'race' && (
                    <>
                        <option value="dragonborn">Dragonborn</option>
                        <option value="dwarf">Dwarf</option>
                        <option value="elf">Elf</option>
                        <option value="gnome">Gnome</option>
                        <option value="halfling">Halfling</option>
                        <option value="half-orc">Half Orc</option>
                        <option value="tiefling">Tiefling</option>
                        <option value="human-celtic">Human (Celtic)</option>
                    </>
                )}
            </select>

            {/* Sex (only for race) */}
            {filter.type === 'race' && (
                <>
                    <label htmlFor="sex" className="col-form-label">Sex</label>
                    <select 
                        name="sex" 
                        className="form-control"
                        value={filter.sex}
                        onChange={handleSexChange}
                    >
                        <option disabled>Select</option>
                        {sexOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </>
            )}

            {/* Used */}
            <label htmlFor="used" className="col-form-label">Used</label>
            <select 
                name="used" 
                className="form-control"
                value={filter.used}
                onChange={handleUsedChange}
            >
                {usedOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </form>
    );
}

export default NameFilterForm;

