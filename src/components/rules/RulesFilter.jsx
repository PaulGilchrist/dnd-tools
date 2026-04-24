import { useState, useEffect } from 'react';

function RulesFilter({ filter, onFilterChange }) {
    const [localName, setLocalName] = useState(filter.name);

    useEffect(() => {
        setLocalName(filter.name);
     }, [filter.name]);

    const handleNameChange = (e) => {
        const value = e.target.value;
        setLocalName(value);
        
        if (value.length < 100) {
            onFilterChange('name', value);
         }
     };

    return (
         <form className="filter-form">
             {/* Name */}
             <label htmlFor="rulesName" className="col-form-label">Name</label>
             <div className={`has-error ${localName && localName.length >= 100 ? 'invalid' : ''}`}>
                 <input 
                    type="text" 
                    className="form-control" 
                    id="rulesName" 
                    name="name"
                    value={localName}
                    onChange={(e) => {
                        handleNameChange(e);
                     }}
                    maxLength="100"
                    placeholder="Filter rules..."
                 />
                 {localName && localName.length >= 100 && (
                     <div className="alert alert-danger">
                        Search text should be less than 100 characters
                     </div>
                 )}
             </div>
         </form>
     );
}

export default RulesFilter;