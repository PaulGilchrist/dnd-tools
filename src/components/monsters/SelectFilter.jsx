import { useState, useEffect } from 'react';

function SelectFilter({ label, name, value, options, onChange }) {
    return (
        <>
            <label htmlFor={name} className="col-form-label">{label}</label>
            <select 
                name={name} 
                className="form-control"
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                }}
            >
                <option value="All">All</option>
                {options.map((option) => (
                    <option key={option.value || option} value={option.value || option}>
                        {option.label || option}
                    </option>
                ))}
            </select>
        </>
    );
}

export default SelectFilter;
