import { useState, useEffect } from 'react';

function NameInput({ filter, updateFilter }) {
    const [localValue, setLocalValue] = useState(filter.name);

    useEffect(() => {
        setLocalValue(filter.name);
    }, [filter.name]);

    const handleChange = (e) => {
        const value = e.target.value;
        setLocalValue(value);
        
        if (value.length < 50) {
            updateFilter('name', value);
        }
    };

    return (
        <>
            <label htmlFor="name" className="col-form-label">Name</label>
            <div className={`has-error ${localValue && localValue.length >= 50 ? 'invalid' : ''}`}>
                <input 
                    type="text" 
                    className="form-control" 
                    id="name" 
                    name="name"
                    value={localValue}
                    onChange={handleChange}
                    pattern="[A-Za-z ]+" 
                    maxLength="50"
                />
                {localValue && localValue.length >= 50 && (
                    <div className="alert alert-danger">
                        Name should be less than 50 characters
                    </div>
                )}
            </div>
        </>
    );
}

export default NameInput;
