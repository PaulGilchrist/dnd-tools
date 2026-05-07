function NameInput({ filter, updateFilter }) {
    const handleChange = (e) => {
        const value = e.target.value;
        
        if (value.length < 50) {
            updateFilter('name', value);
        }
    };

    return (
        <>
            <label htmlFor="name" className="col-form-label">Name</label>
            <div className={`has-error ${(filter.name && filter.name.length >= 50) ? 'invalid' : ''}`}>
                <input 
                    type="text" 
                    className="form-control" 
                    id="name" 
                    name="name"
                    value={filter.name ?? ''}
                    onChange={handleChange}
                    pattern="[A-Za-z ]+" 
                    maxLength="50"
                />
                {filter.name && filter.name.length >= 50 && (
                    <div className="alert alert-danger">
                        Name should be less than 50 characters
                    </div>
                )}
            </div>
        </>
    );
}

export default NameInput;
