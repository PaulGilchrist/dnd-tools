function RulesFilter({ filter, onFilterChange }) {
    const handleNameChange = (e) => {
        onFilterChange('name', e.target.value);
    };

    return (
        <form className="filter-form">
            {/* Name */}
            <label htmlFor="rulesName" className="col-form-label">Name</label>
            <div>
                <input
                    type="text"
                    className="form-control"
                    id="rulesName"
                    name="name"
                    value={filter.name ?? ''}
                    onChange={handleNameChange}
                    maxLength="100"
                    placeholder="Filter rules..."
                />
            </div>
        </form>
    );
}

export default RulesFilter;
