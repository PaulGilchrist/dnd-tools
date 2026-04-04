import { useState, useEffect } from 'react';

function FilterForm({ children }) {
    return (
        <form className="filter-form">
            {children}
        </form>
    );
}

export default FilterForm;
