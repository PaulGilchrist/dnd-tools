import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './NavTop.css';

function NavTop() {
    const [selected, setSelected] = useState('');
    const location = useLocation();

    useEffect(() => {
        // Check if there's a saved URL in localStorage
        const url = localStorage.getItem('url');
        if (url) {
            localStorage.removeItem('url');
        }

        // Update selected state based on current route
        const updateSelected = () => {
            if (location.pathname.includes('monster')) {
                setSelected('monsters');
            } else if (location.pathname.includes('rules')) {
                setSelected('rules');
            } else {
                setSelected('');
            }
        };

        updateSelected();
    }, [location]);

    const showDropdown = (name) => {
        console.log('Show Dropdown:', name, selected);
        return name === selected;
    };

    const handleSetSelected = (name) => {
        setSelected(prev => prev === name ? '' : name);
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
                    <li className="nav-item">
                        <NavLink 
                            to="/equipment-items" 
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                        >
                            Equipment
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink 
                            to="/locations" 
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                        >
                            Locations
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink 
                            to="/magic-items" 
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                        >
                            Magic Items
                        </NavLink>
                    </li>
                    <li className="nav-item dropdown">
                        <a 
                            className={`nav-link dropdown-toggle ${showDropdown('monsters') ? 'active' : ''}`} 
                            href="#" 
                            id="navbarDropdownMonsters" 
                            role="button" 
                            aria-expanded={showDropdown('monsters')}
                            onClick={(e) => {
                                e.preventDefault();
                                handleSetSelected('monsters');
                            }}
                        >
                            Monsters
                        </a>
                        <ul 
                            className={`dropdown-menu ${showDropdown('monsters') ? 'show' : ''}`}
                            aria-labelledby="navbarDropdownMonsters"
                        >
                            <li>
                                <NavLink 
                                    to="/monster/encounters" 
                                    className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
                                    onClick={() => setSelected('')}
                                >
                                    Encounters
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                    to="/monster/lore" 
                                    className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
                                    onClick={() => setSelected('')}
                                >
                                    Lore
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                    to="/monster/search" 
                                    className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
                                    onClick={() => setSelected('')}
                                >
                                    Search
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <NavLink 
                            to="/names" 
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                        >
                            Names
                        </NavLink>
                    </li>
                    <li className="nav-item dropdown">
                        <a 
                            className={`nav-link dropdown-toggle ${showDropdown('rules') ? 'active' : ''}`} 
                            href="#" 
                            id="navbarDropdownRules" 
                            role="button" 
                            aria-expanded={showDropdown('rules')}
                            onClick={(e) => {
                                e.preventDefault();
                                handleSetSelected('rules');
                            }}
                        >
                            Rules
                        </a>
                        <ul 
                            className={`dropdown-menu ${showDropdown('rules') ? 'show' : ''}`}
                            aria-labelledby="navbarDropdownRules"
                        >
                            <li><NavLink to="/rules/general" className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`} onClick={() => setSelected('')}>General</NavLink></li>
                            <li><NavLink to="/rules/ability-scores" className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`} onClick={() => setSelected('')}>Abilities</NavLink></li>
                            <li><NavLink to="/rules/classes" className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`} onClick={() => setSelected('')}>Classes</NavLink></li>
                            <li><NavLink to="/rules/conditions" className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`} onClick={() => setSelected('')}>Conditions</NavLink></li>
                            <li><NavLink to="/rules/feats" className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`} onClick={() => setSelected('')}>Feats</NavLink></li>
                            <li><NavLink to="/rules/races" className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`} onClick={() => setSelected('')}>Races</NavLink></li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <NavLink 
                            to="/spells" 
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                        >
                            Spells
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavTop;
