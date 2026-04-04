import { useState, useEffect } from 'react';

function RangeInputs({ minLabel = "min", maxLabel = "max" }) {
    const [localMin, setLocalMin] = useState(0);
    const [localMax, setLocalMax] = useState(0);

    useEffect(() => {
        // Sync with parent when filter changes
    }, []);

    const handleMinChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        setLocalMin(value);
    };

    const handleMaxChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        setLocalMax(value);
    };

    return (
        <div className="row">
            <div className="col">
                <input 
                    type="number" 
                    className="column form-control" 
                    value={localMin}
                    onChange={handleMinChange}
                    min="0" 
                    max="25" 
                    step="0.25" 
                    placeholder={minLabel}
                />
            </div>
            <div className="col">
                <input 
                    type="number" 
                    className="column form-control" 
                    value={localMax}
                    onChange={handleMaxChange}
                    min="0" 
                    max="25" 
                    step="0.25" 
                    placeholder={maxLabel}
                />
            </div>
        </div>
    );
}

export default RangeInputs;
