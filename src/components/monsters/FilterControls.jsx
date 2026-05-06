import { useState, useEffect } from 'react';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function FilterControls({ filter, updateFilter }) {
    const [localName, setLocalName] = useState(filter.name);
    const [localCrMin, setLocalCrMin] = useState(filter.challengeRatingMin?.toString() ?? '');
    const [localCrMax, setLocalCrMax] = useState(filter.challengeRatingMax?.toString() ?? '');
    const [localXpMin, setLocalXpMin] = useState(filter.xpMin?.toString() ?? '');
    const [localXpMax, setLocalXpMax] = useState(filter.xpMax?.toString() ?? '');

    useEffect(() => {
        setLocalName(filter.name);
    }, [filter.name]);

    useEffect(() => {
        setLocalCrMin(filter.challengeRatingMin?.toString() ?? '');
    }, [filter.challengeRatingMin]);

    useEffect(() => {
        setLocalCrMax(filter.challengeRatingMax?.toString() ?? '');
    }, [filter.challengeRatingMax]);

    useEffect(() => {
        setLocalXpMin(filter.xpMin?.toString() ?? '');
    }, [filter.xpMin]);

    useEffect(() => {
        setLocalXpMax(filter.xpMax?.toString() ?? '');
    }, [filter.xpMax]);

    const handleNameChange = (e) => {
        const value = e.target.value;
        setLocalName(value);
        
        if (value.length < 50) {
            updateFilter('name', value);
        }
    };

    const environments = ['arctic', 'coastal', 'desert', 'forest', 'grassland', 'hill', 'mountain', 'swamp', 'underdark', 'underwater', 'urban'];
    const types = ['aberration', 'beast', 'celestial', 'construct', 'dragon', 'elemental', 'fey', 'fiend', 'giant', 'humanoid', 'monstrosity', 'ooze', 'plant', 'undead'];
    const sizes = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
    const bookmarkedOptions = ['Bookmarked'];

    return (
        <>
            {/* Name */}
            <label htmlFor="name" className="col-form-label">Name</label>
            <div className={`has-error ${localName && localName.length >= 50 ? 'invalid' : ''}`}>
                <input 
                    type="text" 
                    className="form-control" 
                    id="name" 
                    name="name"
                    value={localName}
                    onChange={(e) => {
                        handleNameChange(e);
                    }}
                    pattern="[A-Za-z ]+" 
                    maxLength="50"
                />
                {localName && localName.length >= 50 && (
                    <div className="alert alert-danger">
                        Name should be less than 50 characters
                    </div>
                )}
            </div>

            {/* Challenge Rating */}
            <label htmlFor="challengeRatingMin" className="col-form-label">Challenge Rating</label>
            <div className="row">
                <div className="col">
                    <input 
                        type="number" 
                        className="column form-control" 
                        id="challengeRatingMin" 
                        name="challengeRatingMin"
                        value={localCrMin}
                        onChange={(e) => {
                            const value = e.target.value;
                            setLocalCrMin(value);
                            updateFilter('challengeRatingMin', value === '' ? '' : parseFloat(value));
                        }}
                        min="0" 
                        max="25" 
                        step="0.25" 
                        placeholder="min"
                    />
                </div>
                <div className="col">
                    <input 
                        type="number" 
                        className="column form-control" 
                        id="challengeRatingMax" 
                        name="challengeRatingMax"
                        value={localCrMax}
                        onChange={(e) => {
                            const value = e.target.value;
                            setLocalCrMax(value);
                            updateFilter('challengeRatingMax', value === '' ? '' : parseFloat(value));
                        }}
                        min="0" 
                        max="25" 
                        step="0.25" 
                        placeholder="max"
                    />
                </div>
            </div>

            {/* XP */}
            <label htmlFor="xpMin" className="col-form-label">XP</label>
            <div className="row">
                <div className="col">
                    <input 
                        type="number" 
                        className="column form-control" 
                        id="xpMin" 
                        name="xpMin"
                        value={localXpMin}
                        onChange={(e) => {
                            const value = e.target.value;
                            setLocalXpMin(value);
                            updateFilter('xpMin', value === '' ? '' : parseInt(value));
                        }}
                        min="0" 
                        max="50000" 
                        step="25" 
                        placeholder="min"
                    />
                </div>
                <div className="col">
                    <input 
                        type="number" 
                        className="column form-control" 
                        id="xpMax" 
                        name="xpMax"
                        value={localXpMax}
                        onChange={(e) => {
                            const value = e.target.value;
                            setLocalXpMax(value);
                            updateFilter('xpMax', value === '' ? '' : parseInt(value));
                        }}
                        min="0" 
                        max="50000" 
                        step="25" 
                        placeholder="max"
                    />
                </div>
            </div>

            {/* Environment */}
            <label htmlFor="environment" className="col-form-label">Environment</label>
            <select 
                name="environment" 
                className="form-control"
                value={filter.environment}
                onChange={(e) => {
                    updateFilter('environment', e.target.value);
                }}
            >
                <option>All</option>
                {environments.map((env) => (
                    <option key={env} value={env}>{capitalizeFirstLetter(env)}</option>
                ))}
            </select>

            {/* Type */}
            <label htmlFor="type" className="col-form-label">Type</label>
            <select 
                name="type" 
                className="form-control"
                value={filter.type}
                onChange={(e) => {
                    updateFilter('type', e.target.value);
                }}
            >
                <option>All</option>
                {types.map((type) => (
                    <option key={type} value={type}>{capitalizeFirstLetter(type)}</option>
                ))}
            </select>

            {/* Size */}
            <label htmlFor="size" className="col-form-label">Size</label>
            <select 
                name="size" 
                className="form-control"
                value={filter.size}
                onChange={(e) => {
                    updateFilter('size', e.target.value);
                }}
            >
                <option>All</option>
                {sizes.map((size) => (
                    <option key={size} value={size}>{capitalizeFirstLetter(size)}</option>
                ))}
            </select>

            {/* Bookmarked */}
            <label htmlFor="bookmarked" className="col-form-label">Bookmarked</label>
            <select 
                name="bookmarked" 
                className="form-control"
                value={filter.bookmarked}
                onChange={(e) => {
                    updateFilter('bookmarked', e.target.value);
                }}
            >
                <option>All</option>
                {bookmarkedOptions.map((opt) => (
                    <option key={opt} value={opt}>{capitalizeFirstLetter(opt)}</option>
                ))}
            </select>
        </>
    );
}

export default FilterControls;
