import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './NavTop.css';

function NavTop() {
    const [selected, setSelected] = useState('');
    const [ruleVersion, setRuleVersion] = useState('5e');
    const [activeSpellRoute, setActiveSpellRoute] = useState('');
    const [activeMonsterRoute, setActiveMonsterRoute] = useState('');
    const [activeMagicItemsRoute, setActiveMagicItemsRoute] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    // Load saved rule version from localStorage on initial mount
    useEffect(() => {
        const savedRuleVersion = localStorage.getItem('ruleVersion');
        if (savedRuleVersion) {
            setRuleVersion(savedRuleVersion);
        }
    }, []);

    useEffect(() => {
        // Check if there's a saved URL in localStorage
        const url = localStorage.getItem('url');
        if (url) {
            localStorage.removeItem('url');
        }

        // Update selected state based on current route
        const updateSelected = () => {
            // Track which spell route is active
            if (location.pathname === '/spells' && ruleVersion === '5e') {
                setActiveSpellRoute('5e');
            } else if (location.pathname === '/2024/spells' && ruleVersion === '2024') {
                setActiveSpellRoute('2024');
            } else if (location.pathname === '/spells' || location.pathname === '/2024/spells') {
                // User is on a spells page but version doesn't match dropdown
                // Keep track of which version they're on
                setActiveSpellRoute(location.pathname === '/2024/spells' ? '2024' : '5e');
            } else {
                setActiveSpellRoute('');
            }

            // Track which monster route is active
            if (location.pathname === '/monsters/search' && ruleVersion === '5e') {
                setActiveMonsterRoute('5e');
            } else if (location.pathname === '/2024/monsters/search' && ruleVersion === '2024') {
                setActiveMonsterRoute('2024');
            } else if (location.pathname === '/monsters/search' || location.pathname === '/2024/monsters/search') {
                // User is on a monsters page but version doesn't match dropdown
                // Keep track of which version they're on
                setActiveMonsterRoute(location.pathname === '/2024/monsters/search' ? '2024' : '5e');
            }

            // Track which lore route is active
            if (location.pathname === '/monsters/lore' && ruleVersion === '5e') {
                setActiveMonsterRoute('lore-5e');
            } else if (location.pathname === '/2024/monsters/lore' && ruleVersion === '2024') {
                setActiveMonsterRoute('lore-2024');
            } else if (location.pathname === '/monsters/lore' || location.pathname === '/2024/monsters/lore') {
                // User is on a lore page but version doesn't match dropdown
                setActiveMonsterRoute(location.pathname === '/2024/monsters/lore' ? 'lore-2024' : 'lore-5e');
            }

            // Track which magic items route is active
            if (location.pathname === '/magic-items' && ruleVersion === '5e') {
                setActiveMagicItemsRoute('5e');
            } else if (location.pathname === '/2024/magic-items' && ruleVersion === '2024') {
                setActiveMagicItemsRoute('2024');
            } else if (location.pathname === '/magic-items' || location.pathname === '/2024/magic-items') {
                // User is on a magic items page but version doesn't match dropdown
                setActiveMagicItemsRoute(location.pathname === '/2024/magic-items' ? '2024' : '5e');
            }

            if (location.pathname.includes('monsters/lore') || 
                location.pathname.includes('monsters/encounters') || 
                location.pathname.includes('monsters/search')) {
                // We're on a submenu page, clear selection to collapse menu
                setSelected('');
            } else if (location.pathname.includes('rules/general') || 
                       location.pathname.includes('rules/ability-scores') || 
                       location.pathname.includes('rules/classes') || 
                       location.pathname.includes('rules/conditions') || 
                       location.pathname.includes('rules/feats') || 
                       location.pathname.includes('rules/races')) {
                // We're on a submenu page, clear selection to collapse menu
                setSelected('');
            } else if (location.pathname.includes('monsters')) {
                setSelected('monsters');
            } else if (location.pathname.includes('rules')) {
                setSelected('rules');
            } else {
                setSelected('');
            }
        };

        updateSelected();
    }, [location, ruleVersion]);

    const showDropdown = (name) => {
        console.log('Show Dropdown:', name, selected);
        return name === selected;
    };

    const handleSetSelected = (name) => {
        setSelected(prev => prev === name ? '' : name);
    };

    const handleRuleChange = (e) => {
        const newVersion = e.target.value;
        // Save the rule version to localStorage
        localStorage.setItem('ruleVersion', newVersion);
        // If spells route is active, navigate to appropriate spells route
        if (activeSpellRoute) {
    const newLink = newVersion === '2024' ? '/2024/spells' : '/spells';
    navigate(newLink);
        }
        // If monsters search route is active, navigate to appropriate monsters route
        else if (activeMonsterRoute === '5e' || activeMonsterRoute === '2024') {
    const newLink = newVersion === '2024' ? '/2024/monsters/search' : '/monsters/search';
    navigate(newLink);
        }
        // If lore route is active, navigate to appropriate lore route
        else if (activeMonsterRoute === 'lore-5e' || activeMonsterRoute === 'lore-2024') {
    const newLink = newVersion === '2024' ? '/2024/monsters/lore' : '/monsters/lore';
    navigate(newLink);
        }
        // If magic items route is active, navigate to appropriate magic items route
        else if (activeMagicItemsRoute === '5e' || activeMagicItemsRoute === '2024') {
    const newLink = newVersion === '2024' ? '/2024/magic-items' : '/magic-items';
    navigate(newLink);
        }
        setRuleVersion(newVersion);
    };

    const spellLink = ruleVersion === '2024' ? '/2024/spells' : '/spells';
    const monsterSearchLink = ruleVersion === '2024' ? '/2024/monsters/search' : '/monsters/search';
    const monsterLoreLink = ruleVersion === '2024' ? '/2024/monsters/lore' : '/monsters/lore';
    const magicItemsLink = ruleVersion === '2024' ? '/2024/magic-items' : '/magic-items';

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
                            to={magicItemsLink} 
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
                                    to="/monsters/encounters" 
                                    className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
                                    onClick={() => setSelected('')}
                                >
                                    Encounters
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                    to={monsterLoreLink} 
                                    className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
                                    onClick={() => setSelected('')}
                                >
                                    Lore
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                    to={monsterSearchLink} 
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
                            to={spellLink} 
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                        >
                            Spells
                        </NavLink>
                    </li>
                </ul>
                <div className="dropdown-spell-version">
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

