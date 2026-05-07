import { useState, useEffect } from 'react';
import { useNames } from '../../data/dataService';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem, sanitizeFilter } from '../../utils/localStorage';
import './Names.css';
import NameFilterForm from './NameFilterForm';
import NameListTable from './NameListTable';

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
        // Initialization guard: only run when namesData is first loaded and names haven't been set yet
        if (!namesData || namesData.length === 0 || names.length > 0) {
            return;
        }

        setNames(namesData);

        // Set search filters from localStorage
        const filterJson = getLocalStorageItem(LOCAL_STORAGE_KEYS.NAMES_FILTER);
        if (filterJson) {
            const savedFilter = filterJson;
            
            // Set used names from localStorage first
            const namesUsedJson = getLocalStorageItem(LOCAL_STORAGE_KEYS.NAMES_USED);
            if (namesUsedJson != null) {
                setNamesUsed(namesUsedJson);
            }

            // Set the filter and then call getNames if we have valid selections
            const namesDefaultFilter = { index: '', type: 'Select', sex: 'Select', used: 'All' };
            setFilter(sanitizeFilter(namesDefaultFilter, savedFilter));
            
            // If we have valid selections from localStorage, call getNames after filter is set
            if (savedFilter.index && savedFilter.index !== '' && savedFilter.index !== 'Select') {
                setTimeout(() => getNames(), 0);
            } else {
                // Otherwise just call getNames once to initialize
                setTimeout(() => getNames(), 0);
            }
        } else {
            setLocalStorageItem(LOCAL_STORAGE_KEYS.NAMES_FILTER, filter);
            setTimeout(() => getNames(), 0);
        }
    }, [namesData]);

    useEffect(() => {
        // Call getNames when filter changes after initial load
        if (names.length > 0 && filter.index !== '') {
            getNames();
        }
    }, [filter]);

    const filterChanged = (newFilter) => {
        // if the index no longer matches the type, change it
        setFilter(newFilter);
        setLocalStorageItem(LOCAL_STORAGE_KEYS.NAMES_FILTER, newFilter);
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
            setLocalStorageItem(LOCAL_STORAGE_KEYS.NAMES_USED, newUsed);
            return newUsed;
        });
    };

    if (loading) {
        return <div className="list"><div>Loading names...</div></div>;
    }

    return (
        <div className="names-table">
            <NameFilterForm filter={filter} setFilter={setFilter} filterChanged={filterChanged} />
            <br/>
            {shownNames.firstNames && shownNames.firstNames.length > 0 && (
                <NameListTable filter={filter} shownNames={shownNames} isNameUsed={isNameUsed} toggleUsed={toggleUsed} />
            )}
        </div>
    );
}

export default Names;

