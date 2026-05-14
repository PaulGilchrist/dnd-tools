import { useState, useEffect } from 'react';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// ─── Filter section helpers (extracted to reduce function line count) ───

function NameFilter({ filter, updateFilter }) {
    const [localName, setLocalName] = useState(filter.name);
    useEffect(() => { setLocalName(filter.name); }, [filter.name]);

    const handleNameChange = (e) => {
        const value = e.target.value;
        setLocalName(value);
        if (value.length < 50) updateFilter('name', value);
    };

    return (
        <>
            <label htmlFor="name" className="col-form-label">Name</label>
            <div className={`has-error ${(filter.name && filter.name.length >= 50) ? 'invalid' : ''}`}>
                <input
                    type="text" className="form-control" id="name" name="name"
                    value={localName}
                    onChange={handleNameChange}
                    pattern="[A-Za-z ]+" maxLength="50"
                />
                {filter.name && filter.name.length >= 50 && (
                    <div className="alert alert-danger">Name should be less than 50 characters</div>
                )}
            </div>
        </>
    );
}

function RangeInput({ id, value, onChange, min, max, step, placeholder }) {
    return (
        <input
            type="number" className="column form-control" id={id} name={id}
            value={value?.toString() ?? ''}
            onChange={onChange}
            min={min} max={max} step={step} placeholder={placeholder}
        />
    );
}

function SelectOption({ opt, capitalize }) {
    return (
        <option key={opt} value={opt}>{capitalize ? capitalizeFirstLetter(opt) : opt}</option>
    );
}

function FilterControls({ filter, updateFilter }) {
    const environments = ['arctic', 'coastal', 'desert', 'forest', 'grassland', 'hill', 'mountain', 'swamp', 'underdark', 'underwater', 'urban'];
    const types = ['aberration', 'beast', 'celestial', 'construct', 'dragon', 'elemental', 'fey', 'fiend', 'giant', 'humanoid', 'monstrosity', 'ooze', 'plant', 'undead'];
    const sizes = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
    const bookmarkedOptions = ['Bookmarked'];

    const handleNumberChange = (filterKey, parseFn) => (e) => {
        const value = e.target.value;
        updateFilter(filterKey, value === '' ? '' : parseFn(value));
    };

    return (
        <>
            {/* Name */}
            <NameFilter filter={filter} updateFilter={updateFilter} />

            {/* Challenge Rating */}
            <label htmlFor="challengeRatingMin" className="col-form-label">Challenge Rating</label>
            <div className="row">
                <div className="col">
                    <RangeInput id="challengeRatingMin" value={filter.challengeRatingMin}
                        onChange={handleNumberChange('challengeRatingMin', v => (v === '' ? '' : parseFloat(v)))}
                        min="0" max="25" step="0.25" placeholder="min" />
                </div>
                <div className="col">
                    <RangeInput id="challengeRatingMax" value={filter.challengeRatingMax}
                        onChange={handleNumberChange('challengeRatingMax', v => (v === '' ? '' : parseFloat(v)))}
                        min="0" max="25" step="0.25" placeholder="max" />
                </div>
            </div>

            {/* XP */}
            <label htmlFor="xpMin" className="col-form-label">XP</label>
            <div className="row">
                <div className="col">
                    <RangeInput id="xpMin" value={filter.xpMin}
                        onChange={handleNumberChange('xpMin', v => (v === '' ? '' : parseInt(v)))}
                        min="0" max="50000" step="25" placeholder="min" />
                </div>
                <div className="col">
                    <RangeInput id="xpMax" value={filter.xpMax}
                        onChange={handleNumberChange('xpMax', v => (v === '' ? '' : parseInt(v)))}
                        min="0" max="50000" step="25" placeholder="max" />
                </div>
            </div>

            {/* Environment */}
            <label htmlFor="environment" className="col-form-label">Environment</label>
            <select name="environment" className="form-control" value={filter.environment ?? 'All'}
                onChange={(e) => updateFilter('environment', e.target.value)}>
                <option>All</option>
                {environments.map((env) => (
                    <SelectOption key={env} opt={env} capitalize />
                ))}
            </select>

            {/* Type */}
            <label htmlFor="type" className="col-form-label">Type</label>
            <select name="type" className="form-control" value={filter.type ?? 'All'}
                onChange={(e) => updateFilter('type', e.target.value)}>
                <option>All</option>
                {types.map((type) => (
                    <SelectOption key={type} opt={type} capitalize />
                ))}
            </select>

            {/* Size */}
            <label htmlFor="size" className="col-form-label">Size</label>
            <select name="size" className="form-control" value={filter.size ?? 'All'}
                onChange={(e) => updateFilter('size', e.target.value)}>
                <option>All</option>
                {sizes.map((size) => (
                    <SelectOption key={size} opt={size} capitalize />
                ))}
            </select>

            {/* Bookmarked */}
            <label htmlFor="bookmarked" className="col-form-label">Bookmarked</label>
            <select name="bookmarked" className="form-control" value={filter.bookmarked ?? 'All'}
                onChange={(e) => updateFilter('bookmarked', e.target.value)}>
                <option>All</option>
                {bookmarkedOptions.map((opt) => (
                    <SelectOption key={opt} opt={opt} />
                ))}
            </select>
        </>
    );
}

export default FilterControls;
