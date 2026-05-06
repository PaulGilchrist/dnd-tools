import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useRuleVersion } from '../context/RuleVersionContext';
import { LOCAL_STORAGE_KEYS, getLocalStorageString, setLocalStorageString, removeLocalStorageItem } from '../utils/localStorage';
import useRouteInfo from '../hooks/useRouteInfo';
import './NavTop.css';

function NavTop() {
    const { ruleVersion, setRuleVersion } = useRuleVersion();
    const { navRoutes, selected, setSelected, showDropdown, handleSetSelected, isDropdownActive } = useRouteInfo(ruleVersion);

    useEffect(() => {
        const url = getLocalStorageString(LOCAL_STORAGE_KEYS.URL);
        if (url) {
            removeLocalStorageItem(LOCAL_STORAGE_KEYS.URL);
        }
    }, []);

    const handleRuleChange = (e) => {
        const newVersion = e.target.value;
        setLocalStorageString(LOCAL_STORAGE_KEYS.RULE_VERSION, newVersion);
        setRuleVersion(newVersion);
    };

    return (
        <nav className="navbar navbar-dark bg-dark navbar-expand-md fixed-top">
            <NavLink 
                to="/" 
                className="navbar-brand ms-2"
                end
            >
                D&D Tools
            </NavLink>
            <button 
                className="navbar-toggler" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarSupportedContent"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav">
                    {navRoutes.map((item) => {
                        if (item.type === 'link') {
                            return (
                                <li className="nav-item" key={item.key}>
                                    <NavLink 
                                        to={item.path} 
                                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                                    >
                                        {item.label}
                                    </NavLink>
                                </li>
                            );
                        }

                        if (item.type === 'dropdown') {
                            const dropdownId = `navbarDropdown${item.key.charAt(0).toUpperCase() + item.key.slice(1)}`;
                            return (
                                <li className="nav-item dropdown" key={item.key}>
                                    <a 
                                        className={`nav-link dropdown-toggle ${isDropdownActive(item.key) || showDropdown(item.key) ? 'active' : ''}`}
                                        href="#"
                                        id={dropdownId}
                                        role="button"
                                        aria-expanded={showDropdown(item.key)}
                                        onClick={(e) => { 
                                            e.preventDefault(); 
                                            handleSetSelected(item.key); 
                                        }}
                                    >
                                        {item.label}
                                    </a>
                                    <ul 
                                        className={`dropdown-menu ${showDropdown(item.key) ? 'show' : ''}`}
                                        aria-labelledby={dropdownId}
                                    >
                                        {item.items.map(dropdownItem => (
                                            <li key={dropdownItem.path}>
                                                <NavLink 
                                                    to={dropdownItem.path}
                                                    className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
                                                    onClick={() => setSelected('')}
                                                >
                                                    {dropdownItem.label}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            );
                        }

                        return null;
                    })}
                </ul>
                <div className="navTop-dropdown-spell-version">
                    <select 
                        className="form-select form-select-sm"
                        value={ruleVersion}
                        onChange={handleRuleChange}
                        aria-label="Select rule version"
                    >
                        <option value="5e">5e</option>
                        <option value="2024">2024</option>
                    </select>
                </div>
            </div>
        </nav>
    );
}

export default NavTop;
