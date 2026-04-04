import { useState, useEffect } from 'react';
import { useNames } from '../data/dataService';
import './Names.css';

// Javascript utilities (matching Angular)
const utils = {
    scrollIntoView: function(index) {
        const element = document.getElementById(index);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
};

function Names() {
    const [names, setNames] = useState([]);
    const [namesUsed, setNamesUsed] = useState([]);
    const [shownNames, setShownNames] = useState({
        familyType: null,
        firstNames: [],
        lastNames: []
    });
    const [filter, setFilter] = useState({
        index: '',
        type: 'Select', // race or building
        sex: 'Select',
        used: 'All'
    });

    // Fetch data
    const { data: namesData, loading } = useNames();

    useEffect(() => {
        if (namesData && namesData.length > 0) {
            setNames(namesData);

            // Set search filters from localStorage
            let filterJson = localStorage.getItem('namesFilter');
            if (filterJson) {
                const savedFilter = JSON.parse(filterJson);
                
                // Set used names from localStorage first
                let namesUsedJson = localStorage.getItem('namesUsed');
                if (namesUsedJson != null) {
                    setNamesUsed(JSON.parse(namesUsedJson));
                }

                // Set the filter and then call getNames if we have valid selections
                setFilter({ ...filter, ...savedFilter });
                
                // If we have valid selections from localStorage, call getNames after filter is set
                if (savedFilter.index && savedFilter.index !== '' && savedFilter.index !== 'Select') {
                    setTimeout(() => getNames(), 0);
                } else {
                    // Otherwise just call getNames once to initialize
                    setTimeout(() => getNames(), 0);
                }
            } else {
                localStorage.setItem('namesFilter', JSON.stringify(filter));
                setTimeout(() => getNames(), 0);
            }
        }
    }, [namesData]);

    useEffect(() => {
        // Call getNames when filter changes after initial load
        if (names.length > 0 && filter.index !== '') {
            getNames();
        }
    }, [filter, names]);

    const filterChanged = (newFilter) => {
        // if the index no longer matches the type, change it
        localStorage.setItem('namesFilter', JSON.stringify(newFilter));
        getNames(newFilter);
    };

    const getNames = (currentFilter) => {
        setShownNames({
            familyType: null,
            firstNames: [],
            lastNames: []
        });

        const filterToUse = currentFilter || filter;
        
        // Only proceed if we have a valid index selection
        if (!filterToUse.index || filterToUse.index === '' || filterToUse.index === 'Select') {
            return;
        }
        
        const availableNames = names.find(n => n.index === filterToUse.index);
        if (!availableNames) {
            return;
        }

        // Debug: log availableNames to see structure
        console.log('availableNames:', availableNames);

        let firstNames = [];
        let lastNames = [];

        switch (filterToUse.type) {
            case 'building':
                firstNames = availableNames.lists?.first || [];
                lastNames = availableNames.lists?.second || [];
                break;
            case 'race':
                firstNames = filterToUse.sex === 'female' ? availableNames.lists?.females : availableNames.lists?.males;
                if (availableNames.family_type) {
                    lastNames = availableNames.lists?.family || [];
                    setShownNames(prev => ({ ...prev, familyType: availableNames.family_type }));
                }
                break;
            default:
                firstNames = [];
                lastNames = [];
        }

        console.log('firstNames:', firstNames, 'lastNames:', lastNames);

        switch (filterToUse.used) {
            case 'available':
                setShownNames(prev => ({
                    ...prev,
                    firstNames: (firstNames || []).filter(n => !namesUsed.includes(n)),
                    lastNames: (lastNames || []).filter(n => !namesUsed.includes(n))
                }));
                break;
            case 'used':
                setShownNames(prev => ({
                    ...prev,
                    firstNames: (firstNames || []).filter(n => namesUsed.includes(n)),
                    lastNames: (lastNames || []).filter(n => namesUsed.includes(n))
                }));
                break;
            default:
                setShownNames(prev => ({
                    ...prev,
                    firstNames: firstNames || [],
                    lastNames: lastNames || []
                }));
        }
    };

    const isNameUsed = (name) => {
        return namesUsed.includes(name);
    };

    const toggleUsed = (name) => {
        // If the name is in the list, remove it otherwise add it
        setNamesUsed(prev => {
            const index = prev.indexOf(name);
            let newUsed;
            if (index === -1) {
                newUsed = [...prev, name];
            } else {
                newUsed = prev.filter(n => n !== name);
            }
            localStorage.setItem('namesUsed', JSON.stringify(newUsed));
            return newUsed;
        });
    };

    const typeChanged = (newFilter) => {
        setFilter(prev => ({ ...prev, index: 'Select' }));
        filterChanged(newFilter);
    };

    if (loading) {
        return <div className="list"><div>Loading names...</div></div>;
    }

    const renderFirstTable = () => (
        <table className="table table-condensed table-striped table-hover">
            <thead>
                <tr>
                    <th className="col-form-label">
                        {filter.type === 'race' ? (
                            <span>First Names</span>
                        ) : (
                            <span>First Part</span>
                        )}
                    </th>
                    <th className="col-form-label">Used</th>
                </tr>
            </thead>
            <tbody>
                {shownNames.firstNames.map(name => (
                    <tr key={name}>
                        <td>{name}</td>
                        <td>
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                onChange={() => toggleUsed(name)}
                                checked={isNameUsed(name)}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderSecondTable = () => (
        <table className="table table-condensed table-striped table-hover">
            <thead>
                <tr>
                    <th className="col-form-label">
                        {filter.type === 'race' ? (
                            <span>{shownNames.familyType} Names</span>
                        ) : (
                            <span>Last Part</span>
                        )}
                    </th>
                    <th className="col-form-label">Used</th>
                </tr>
            </thead>
            <tbody>
                {shownNames.lastNames.map(name => (
                    <tr key={name}>
                        <td>{name}</td>
                        <td>
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                onChange={() => toggleUsed(name)}
                                checked={isNameUsed(name)}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="names">
            <form className="filter-form">
                {/* Type */}
                <label htmlFor="type" className="col-form-label">Type</label>
                <select 
                    name="type" 
                    className="form-control"
                    value={filter.type}
                    onChange={(e) => {
                        const newFilter = { ...filter, type: e.target.value, index: 'Select' };
                        setFilter(newFilter);
                        localStorage.setItem('namesFilter', JSON.stringify(newFilter));
                    }}
                >
                    <option disabled>Select</option>
                    <option value="building">Building</option>
                    <option value="race">Race</option>
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
                    onChange={(e) => {
                        const newFilter = { ...filter, index: e.target.value };
                        setFilter(newFilter);
                        filterChanged(newFilter);
                    }}
                >
                    {filter.type === 'building' && (
                        <>
                            <option disabled>Select</option>
                            <option value="tavern">Tavern</option>
                        </>
                    )}
                    {filter.type === 'race' && (
                        <>
                            <option disabled>Select</option>
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
                            onChange={(e) => {
                                const newFilter = { ...filter, sex: e.target.value };
                                setFilter(newFilter);
                                filterChanged(newFilter);
                            }}
                        >
                            <option disabled>Select</option>
                            <option value="female">Female</option>
                            <option value="male">Male</option>
                        </select>
                    </>
                )}

                {/* Used */}
                <label htmlFor="used" className="col-form-label">Used</label>
                <select 
                    name="used" 
                    className="form-control"
                    value={filter.used}
                    onChange={(e) => {
                        const newFilter = { ...filter, used: e.target.value };
                        setFilter(newFilter);
                        filterChanged(newFilter);
                    }}
                >
                    <option value="All">All</option>
                    <option value="available">Available</option>
                    <option value="used">Used</option>
                </select>
            </form>

            {shownNames.firstNames && shownNames.firstNames.length > 0 && (
                <div className={`list ${filter.type === 'building' || shownNames.familyType != null ? 'dualList' : ''}`}>
                    {renderFirstTable()}
                    {(filter.type === 'building' || shownNames.familyType != null) && renderSecondTable()}
                </div>
            )}
        </div>
    );
}

export default Names;
